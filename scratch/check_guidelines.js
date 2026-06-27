const { chromium } = require('@playwright/test');
const path = require('path');

const tokenValue = 'mOKEyB5HUaY52eF38MqzIyf7KG3sX2+VMrvnQHdMS65LVhioeLee570YYDVt87+mwjXoJdJcXm8E57ZVC8vq/svIIgQ85WTjsvdZYI7yAJzhBc9edcxEO6uEB+qTG715dbX7uuDGQrRxAPi6TSSRd49AiN1MKI26Axjun3KBC6kx6e/dPmUb9qbE/gs7vCVtIkPFWhvyNvdfjlv6JOvwZ3LcIfvmLEABWjUKZFVVkWM=';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  await context.addInitScript(token => {
    window.localStorage.setItem('auth_token', token);
    window.localStorage.setItem('auth_username', 'Hoàng Văn Bảo');
  }, tokenValue);

  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000/guidelines', { waitUntil: 'load', timeout: 15000 });
  } catch (e) {
    console.log('Timeout, continuing...');
  }

  await page.waitForTimeout(4000);

  // Click 01-overview.md
  const item = page.locator('text=01-overview.md').first();
  if (await item.count() > 0) {
    await item.click();
    await page.waitForTimeout(2000);
  }

  // Get scroll properties of contentColumn
  const contentColumn = page.locator('div[class*="contentColumn"]').first();
  if (await contentColumn.count() > 0) {
    console.log('--- TRƯỚC KHI CUỘN ---');
    console.log('scrollTop:', await contentColumn.evaluate(node => node.scrollTop));
    console.log('scrollHeight:', await contentColumn.evaluate(node => node.scrollHeight));

    // Thực hiện cuộn
    await contentColumn.evaluate(node => {
      node.scrollTop = node.scrollHeight;
    });
    await page.waitForTimeout(2000);

    console.log('--- SAU KHI CUỘN ---');
    console.log('scrollTop:', await contentColumn.evaluate(node => node.scrollTop));

    // Chụp ảnh màn hình lúc này
    const scrolledPath = path.join(__dirname, 'guidelines_scrolled.png');
    await page.screenshot({ path: scrolledPath });
    console.log(`Đã chụp ảnh màn hình sau khi cuộn tại: ${scrolledPath}`);
  } else {
    console.log('Không tìm thấy contentColumn!');
  }

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
