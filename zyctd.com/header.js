const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', req => {
    if (
      req.url().endsWith('.png') ||
      req.url().endsWith('.jpg') ||
      req.url().includes('.css')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('.n-menu li:first-child div:first-child', {
      timeout: 3000,
    });

    const data = await page.evaluate(async () => {
      return Array.from(document.querySelectorAll('.n-menu li:first-child div:first-child span')).map(el => {
        return {
          href: el.querySelector('a').href,
          name: el.querySelector('a').innerHTML,
        };
      });
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
