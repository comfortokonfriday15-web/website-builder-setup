const fs = require('fs');
const p = process.env.USERPROFILE + '\\.claude.json';
const backup = p + '.bak.' + Date.now();
try {
  let j = {};
  if (fs.existsSync(p)) {
    const s = fs.readFileSync(p, 'utf8');
    try { j = JSON.parse(s); } catch (e) { console.error('Existing JSON parse error, aborting'); process.exit(2); }
    fs.copyFileSync(p, backup);
  }
  j.mcpServers = j.mcpServers || {};
  j.mcpServers['21st-dev-magic'] = {
    command: 'npx',
    args: ['-y', '@21st-dev/magic@latest'],
    env: { API_KEY: '2a80f11f3c17b5ea643bd2d9193f875f521c05e4cdeaacd4693ba26f51755d3e' }
  };
  fs.writeFileSync(p, JSON.stringify(j, null, 2), 'utf8');
  console.log('Updated', p);
  console.log('mcpServers keys:', Object.keys(j.mcpServers || {}));
} catch (e) {
  console.error(e);
  process.exit(1);
}
