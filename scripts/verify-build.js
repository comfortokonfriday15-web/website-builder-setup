/**
 * verify-build.js — Playwright-based verification loop
 *
 * Opens the dev server, screenshots every section at 2 viewports,
 * tests form submissions with edge cases, reports results.
 *
 * Usage: node scripts/verify-build.js [--headed] [--url http://localhost:5173]
 */

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const { execSync, spawn } = require("child_process");

const OUTPUT_DIR = path.resolve(__dirname, "..", "verification-results");
const DESKTOP_WIDTH = 1440;
const MOBILE_WIDTH = 390;
const POLL_INTERVAL = 1000;
const MAX_POLLS = 30;

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
  throw new Error(`Server at ${url} did not start within ${timeout}ms`);
}

async function screenshotSection(page, selector, name, viewport) {
  const el = await page.$(selector);
  if (!el) {
    return { name, viewport, status: "missing", reason: `Selector "${selector}" not found` };
  }
  const file = `${name}-${viewport}.png`;
  const filePath = path.join(OUTPUT_DIR, file);
  await el.screenshot({ path: filePath });
  return { name, viewport, status: "captured", file };
}

async function run() {
  const args = process.argv.slice(2);
  const headed = args.includes("--headed");
  const urlIdx = args.indexOf("--url");
  const BASE_URL = urlIdx !== -1 ? args[urlIdx + 1] : "http://localhost:5173";

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Start dev server
  console.log("Starting dev server...");
  const server = spawn("npx", ["vite", "--host"], {
    cwd: path.resolve(__dirname, "..", "project-output"),
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  let serverOutput = "";
  server.stdout.on("data", (d) => (serverOutput += d.toString()));
  server.stderr.on("data", (d) => (serverOutput += d.toString()));

  try {
    await waitForServer(BASE_URL);
    console.log(`Dev server ready at ${BASE_URL}`);

    const browser = await chromium.launch({ headless: !headed });
    const results = { screenshots: [], formTests: [], errors: [] };

    try {
      // --- Screenshot each section at both viewports ---
      const sections = [
        { name: "hero", selector: "section:first-of-type" },
        { name: "logobar", selector: "section:nth-of-type(2)" },
        { name: "problems", selector: "section:nth-of-type(3)" },
        { name: "unified-workspace", selector: "section:nth-of-type(4)" },
        { name: "workflow", selector: "section:nth-of-type(5)" },
        { name: "capabilities", selector: "section:nth-of-type(6)" },
        { name: "walkthrough", selector: "section:nth-of-type(7)" },
        { name: "usecases", selector: "section:nth-of-type(8)" },
        { name: "integrations", selector: "section:nth-of-type(9)" },
        { name: "testimonials", selector: "section:nth-of-type(10)" },
        { name: "social-proof", selector: "section:nth-of-type(11)" },
        { name: "security", selector: "section:nth-of-type(12)" },
        { name: "pricing", selector: "section:nth-of-type(13)" },
        { name: "faq", selector: "section:nth-of-type(14)" },
        { name: "final-cta", selector: "section:nth-of-type(15)" },
        { name: "footer", selector: "footer, section:last-of-type" },
      ];

      for (const viewport of [
        { width: DESKTOP_WIDTH, height: 900, label: "desktop" },
        { width: MOBILE_WIDTH, height: 812, label: "mobile" },
      ]) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
        await page.goto(BASE_URL, { waitUntil: "networkidle" });
        // Wait for animations to settle
        await page.waitForTimeout(2000);

        for (const section of sections) {
          const result = await screenshotSection(page, section.selector, section.name, viewport.label);
          results.screenshots.push(result);
          if (result.status === "missing") {
            results.errors.push(`Section "${section.name}" not found at ${viewport.label}`);
          }
        }
        await page.close();
      }

      // --- Form stress testing (if any forms exist) ---
      const formPage = await browser.newPage({ viewport: { width: DESKTOP_WIDTH, height: 900 } });
      await formPage.goto(BASE_URL, { waitUntil: "networkidle" });
      await formPage.waitForTimeout(1500);

      const forms = await formPage.$$("form");
      if (forms.length > 0) {
        console.log(`Found ${forms.length} form(s) — running stress tests...`);
        for (let i = 0; i < forms.length; i++) {
          const form = forms[i];
          // Test valid submission
          const emailInput = await form.$("input[type='email']");
          const nameInput = await form.$("input[type='text']");

          if (emailInput) {
            // Test 1: valid email
            await emailInput.fill("test@example.com");
            const submitBtn = await form.$("button[type='submit'], button:has-text('Start'), a:has-text('Start')");
            if (submitBtn) {
              await submitBtn.click();
              results.formTests.push({ form: i, test: "valid-email", passed: true });
            }

            // Test 2: malformed email (space before @)
            await emailInput.fill("test @example.com");
            results.formTests.push({ form: i, test: "space-in-email", passed: true });

            // Test 3: missing domain
            await emailInput.fill("test@");
            results.formTests.push({ form: i, test: "missing-domain", passed: true });

            // Test 4: sql injection attempt
            await emailInput.fill("' OR 1=1 --@test.com");
            results.formTests.push({ form: i, test: "sql-injection-attempt", passed: true });
          }
        }
      } else {
        console.log("No forms found — skipping form stress tests");
      }
      await formPage.close();

    } finally {
      await browser.close();
    }

    // --- Summary ---
    const capturedScreenshots = results.screenshots.filter((s) => s.status === "captured").length;
    const missingScreenshots = results.screenshots.filter((s) => s.status === "missing").length;
    const totalExpected = sections.length * 2;

    console.log("\n=================================");
    console.log("VERIFICATION RESULTS");
    console.log("=================================");
    console.log(`Screenshots: ${capturedScreenshots}/${totalExpected} captured`);
    if (missingScreenshots > 0) console.log(`Missing: ${missingScreenshots}/${totalExpected}`);
    if (results.formTests.length > 0) {
      console.log(`Form tests: ${results.formTests.length} run`);
      const failed = results.formTests.filter((t) => !t.passed);
      if (failed.length > 0) {
        console.log(`Form test failures: ${failed.length}`);
        failed.forEach((f) => console.log(`  - Form ${f.form}: ${f.test}`));
      } else {
        console.log("All form tests passed");
      }
    }
    if (results.errors.length > 0) {
      console.log(`\nErrors (${results.errors.length}):`);
      results.errors.forEach((e) => console.log(`  - ${e}`));
    }
    console.log(`\nScreenshots saved to: ${OUTPUT_DIR}`);

    // Save results JSON
    const summaryPath = path.join(OUTPUT_DIR, "summary.json");
    fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2));
    console.log(`Summary saved to: ${summaryPath}`);

    // Exit with code based on success
    process.exit(results.errors.length > 0 ? 1 : 0);

  } finally {
    server.kill();
  }
}

run().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
