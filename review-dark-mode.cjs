const { chromium } = require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs'), path = require('path');
const base = process.argv[2] || 'http://127.0.0.1:4185';
const distribution = path.join(__dirname, fs.existsSync(path.join(__dirname, 'dist')) ? 'dist' : 'redesign/dist');
const assert = (condition, message) => { if (!condition) throw Error(message); };
(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage(), errors = [], failures = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) failures.push(response.url()); });
  await page.goto(base);
  assert(await page.locator('html').getAttribute('data-theme') === 'light', 'Default light system theme');
  assert(await page.locator('.robot-eye-flare').first().evaluate(e => getComputedStyle(e).display) === 'none', 'Light theme has original eyes');
  await page.locator('.theme-toggle').focus();
  await page.keyboard.press('Enter');
  assert(await page.locator('.theme-toggle').getAttribute('aria-pressed') === 'true', 'Keyboard activates dark mode');
  assert(await page.evaluate(() => localStorage.getItem('bm-theme')) === 'dark', 'Choice persisted');
  await page.mouse.move(600, 220);
  await page.waitForTimeout(350);
  const first = await page.locator('.robot-eye-flare').first().evaluate(e => e.style.getPropertyValue('--flare-angle'));
  assert(first && await page.locator('.bm-robot').evaluate(e => e.classList.contains('robot-tracking')), 'Pointer enables eye ray');
  await page.mouse.move(1420, 680);
  await page.waitForTimeout(250);
  const second = await page.locator('.robot-eye-flare').first().evaluate(e => e.style.getPropertyValue('--flare-angle'));
  assert(first !== second, 'Flare changes direction with cursor');
  assert(await page.locator('.robot-pointer-light').count() === 0, 'Eye effect stays local to the robot');
  await page.locator('.chat-launch').focus();
  await page.locator('.chat-launch').click();
  assert(!await page.locator('.bm-robot').evaluate(e => e.classList.contains('robot-tracking')), 'Chat opening clears the flare');
  await page.keyboard.press('Escape');
  await page.dispatchEvent('html', 'pointerleave');
  assert(!await page.locator('.bm-robot').evaluate(e => e.classList.contains('robot-tracking')), 'Pointer leaving clears the flare');
  assert(await page.locator('.robot-eye > rect').first().evaluate(e => getComputedStyle(e).fill) === 'rgb(255, 183, 107)', 'Orange eyes in dark mode');
  await page.mouse.move(700, 280);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'dark-mode-desktop.png' });
  await page.locator('.bm-robot').screenshot({ path: 'dark-mode-robot.png' });
  await page.reload();
  assert(await page.locator('html').getAttribute('data-theme') === 'dark', 'Choice survives reload');
  const routes = [];
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
   const file = path.join(dir, entry.name);
   if (entry.isDirectory()) walk(file);
   else if (entry.name.endsWith('.html')) routes.push('/' + path.relative(distribution, file).replaceAll(path.sep, '/').replace(/index\.html$/, ''));
  });
  walk(distribution);
  for (const route of routes) {
   await page.goto(base + route);
   assert(await page.locator('html').getAttribute('data-theme') === 'dark', 'Theme across route ' + route);
   assert(await page.locator('.theme-toggle').isVisible(), 'Theme control ' + route);
   assert(await page.locator('.bm-robot').isVisible(), 'Robot ' + route);
   assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Desktop overflow ' + route);
  }
  for (const width of [320, 390, 760, 800, 1000, 1150, 1440]) {
   await page.setViewportSize({ width, height: 900 });
   for (const locale of ['/', '/en/']) {
    await page.goto(base + locale);
    await page.evaluate(() => document.fonts.ready);
    assert(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Overflow at ' + width + locale);
    const boxes = await page.locator('.nav').evaluate(nav => [...nav.children].filter(e => getComputedStyle(e).display !== 'none' && getComputedStyle(e).position !== 'absolute').map(e => ({ cls: e.className, x: e.getBoundingClientRect().x, right: e.getBoundingClientRect().right })));
    for (let i = 1; i < boxes.length; i++) assert(boxes[i].x >= boxes[i - 1].right - 1, 'Header collision at ' + width + locale + JSON.stringify(boxes));
    // The existing video controls temporarily hide an overlapping bot. Keyboard focus restores access.
    await page.locator('.chat-launch').focus();
    await page.locator('.chat-launch').click();
    assert(await page.locator('.chat-panel').isVisible(), 'Assistant opens');
    await page.locator('[data-topic="support"]').click();
    assert((await page.locator('.chat-send').getAttribute('href')).startsWith('https://wa.me/50660233159?text='), 'WhatsApp preserved');
    if (width === 390 && locale === '/') {
     await page.waitForTimeout(600);
     await page.screenshot({ path: 'dark-mode-assistant-mobile.png' });
    }
    await page.keyboard.press('Escape');
    assert(!await page.locator('.chat-panel').isVisible(), 'Assistant closes with Escape');
    if (width <= 760) {
     await page.locator('.menu').click();
     assert(await page.locator('.navlinks').isVisible(), 'Mobile menu');
     await page.keyboard.press('Escape');
    }
    if (width === 390 && locale === '/') {
     await page.locator('.theme-toggle').focus();
     await page.mouse.move(15, 100);
     await page.waitForTimeout(1600);
     await page.screenshot({ path: 'dark-mode-mobile.png' });
    }
   }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.mouse.move(400, 200);
  assert(await page.locator('.robot-eye-flare').first().evaluate(e => getComputedStyle(e).display) === 'none', 'Reduced motion keeps a fixed eye glow');
  assert(!await page.locator('.bm-robot').evaluate(e => e.classList.contains('robot-tracking')), 'Reduced motion resets tracking');
  const other = await context.newPage();
  await other.goto(base + '/contacto/');
  await other.locator('.theme-toggle').click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  await other.close();
  await page.reload();
  assert(await page.locator('html').getAttribute('data-theme') === 'light', 'Can return to persistent light theme');
  await page.emulateMedia({ colorScheme: 'dark' });
  assert(await page.locator('html').getAttribute('data-theme') === 'light', 'Explicit choice overrides OS');
  const system = await browser.newContext({ colorScheme: 'dark', isMobile: true, hasTouch: true, viewport: { width: 390, height: 844 } });
  const fresh = await system.newPage();
  await fresh.goto(base);
  assert(await fresh.locator('html').getAttribute('data-theme') === 'light', 'Fresh visitor starts light even on a dark OS');
  await fresh.locator('.theme-toggle').click();
  await fresh.dispatchEvent('body', 'pointermove', { clientX: 100, clientY: 100, pointerType: 'touch' });
  assert(!await fresh.locator('.bm-robot').evaluate(e => e.classList.contains('robot-tracking')), 'Touch has static glow');
  await fresh.emulateMedia({ colorScheme: 'light' });
  assert(await fresh.locator('html').getAttribute('data-theme') === 'dark', 'Manual dark choice survives OS changes');
  await system.close();
  const restricted = await browser.newContext();
  await restricted.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }); });
  const blocked = await restricted.newPage();
  await blocked.goto(base);
  await blocked.locator('.theme-toggle').click();
  assert(await blocked.locator('html').getAttribute('data-theme') === 'dark', 'Theme works with storage blocked');
  await restricted.close();
  assert(!errors.length, 'Browser errors: ' + JSON.stringify(errors));
  assert(!failures.length, 'Resource failures: ' + JSON.stringify(failures));
  console.log(JSON.stringify({ pages: routes.length, widths: 7, bilingual: true, persistent: true, lightByDefault: true, crossTab: true, keyboard: true, pointerFlare: true, reducedMotion: true, touch: true, blockedStorage: true, browserErrors: errors.length, resourceFailures: failures.length }));
 } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
