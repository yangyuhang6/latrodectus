const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (
      interceptedRequest.url().endsWith('.png') ||
      interceptedRequest.url().endsWith('.jpg') ||
      interceptedRequest.url().includes('.css')) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  try {
    const target = '#hotMCodex';
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector(target, {
      timeout: 3000,
    });

    await page.exposeFunction('target', () => target);

    const data = await page.evaluate(async () => {
      return Array.from(document.querySelector(await target()).querySelectorAll('a')).map(el => {
        return {
          href: el.href,
          name: el.innerHTML,
        };
      });
    });
    print(data);

  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
