require('dotenv').config();
require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const TRANSPORT = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_PORT === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

function baseHtml(body) {
  return `<html><body style="font-family:sans-serif;padding:20px;max-width:600px;margin:auto">${body}</body></html>`;
}

async function sendEmail(to, subject, html) {
  await TRANSPORT.sendMail({ from: `"Samuel" <${process.env.SMTP_USER}>`, to, subject, html });
}

async function sendNtfy(msg) {
  const https = require('https');
  const data = JSON.stringify({ topic: 'Alert', title: 'BookSmart', message: msg, tags: ['envelope'], priority: 4 });
  await new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'ntfy.sh', method: 'POST', path: '/', headers: { 'Content-Type': 'application/json' } }, (res) => { res.on('data', () => {}); res.on('end', resolve); });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const DELAY_MS = 35000;

function isPermanentBounce(err) {
  const m = (err.message || '').toLowerCase();
  return m.includes('address') || m.includes('mailbox') || m.includes('recipient') || m.includes('user unknown') || m.includes('does not exist') || m.includes('invalid');
}

async function main() {
  const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

  try {
    console.log('=== Fixing step 1 enrollments ===');
    const step1 = await prisma.sequenceEnrollment.findMany({ where: { completed: false, currentStep: 1 }, include: { lead: true } });
    let fixed = 0;
    for (const e of step1) {
      const step0 = await prisma.emailEvent.findFirst({ where: { leadId: e.leadId, type: 'sent', stepOrder: 0 }, orderBy: { createdAt: 'asc' } });
      if (step0) {
        const d = new Date(step0.createdAt.getTime() + 3 * 86400000);
        await prisma.sequenceEnrollment.update({ where: { id: e.id }, data: { nextSendAt: d } });
        console.log('  Fixed ' + e.lead.email + ' -> ' + d.toISOString());
        fixed++;
      }
    }
    console.log('Fixed ' + fixed + ' step 1 enrollments\n');

    console.log('=== Sending step 0 emails ===');
    const today = new Date(); today.setHours(0,0,0,0);
    const [r] = await prisma.$queryRawUnsafe("SELECT COUNT(*)::int AS count FROM \"EmailEvent\" WHERE type = 'sent' AND \"stepOrder\" = 0 AND \"createdAt\" >= $1", today);
    const sentToday = Number(r.count);
    const remaining = 25 - sentToday;
    console.log('Sent today: ' + sentToday + ', cap remaining: ' + remaining);

    if (remaining <= 0) { console.log('Cap reached. Nothing to send.'); return; }

    const leads = await prisma.sequenceEnrollment.findMany({
      where: { completed: false, currentStep: 0, nextSendAt: { lte: new Date() } },
      include: { lead: true, sequence: { include: { steps: { orderBy: { stepOrder: 'asc' } } } } },
      orderBy: { createdAt: 'asc' },
    });

    console.log('Found ' + leads.length + ' step 0 leads due');
    let sent = 0;
    const errors = [];

    for (let i = 0; i < leads.length; i++) {
      const enrollment = leads[i];
      const step = enrollment.sequence.steps[0];
      if (!step) continue;
      const lead = enrollment.lead;

      const html = baseHtml(step.body
        .replace(/{{name}}/g, lead.name)
        .replace(/{{company}}/g, lead.company || 'your company')
        .replace(/{{review_count}}/g, String(lead.reviewCount ?? ''))
        .replace(/{{rating}}/g, String(lead.rating ?? ''))
      );

      try {
        await sendEmail(lead.email, step.subject.replace(/{{company}}/g, lead.company || 'your company'), html);
        console.log('  [' + (i+1) + '/' + leads.length + '] Sent to ' + lead.email);

        await prisma.emailEvent.create({ data: { leadId: lead.id, stepOrder: 0, type: 'sent', to: lead.email, subject: step.subject } });

        const nextStepOrder = 1;
        const hasNext = enrollment.sequence.steps.length > nextStepOrder;
        await prisma.sequenceEnrollment.update({ where: { id: enrollment.id }, data: { currentStep: nextStepOrder, completed: !hasNext, nextSendAt: hasNext ? new Date(Date.now() + step.delayDays * 86400000) : null } });

        sent++;
        if (i < leads.length - 1) await new Promise(r => setTimeout(r, DELAY_MS));
      } catch (err) {
        console.error('  FAILED: ' + lead.email + ' - ' + err.message);
        errors.push(lead.email + ': ' + err.message);
        await prisma.emailEvent.create({ data: { leadId: lead.id, stepOrder: 0, type: isPermanentBounce(err) ? 'bounced' : 'error', to: lead.email, subject: step.subject, error: err.message } });
        if (isPermanentBounce(err)) {
          await prisma.lead.update({ where: { id: lead.id }, data: { status: 'bounced' } });
          await prisma.sequenceEnrollment.update({ where: { id: enrollment.id }, data: { completed: true } });
        }
      }
    }

    console.log('\n=== Summary ===');
    console.log('Sent: ' + sent + '/' + leads.length);
    if (errors.length) { console.log('Errors: ' + errors.length); errors.forEach(e => console.log('  - ' + e)); }

    await sendNtfy('Final batch \u2014 ' + sent + ' step 0 emails sent (' + (sentToday + sent) + '/25 today). Errors: ' + errors.length);
    console.log('Done.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
