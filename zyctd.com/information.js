const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
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

    await page.goto('https://www.zyctd.com/');
    await page.waitForSelector('.art-box-recom', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const list = [];
      Array.from(document.querySelectorAll('.art-box-recom ul li')).forEach((el, idx) => {
        list[idx] = {};
        list[idx].href = el.querySelector('a').href;
        list[idx].title = el.querySelector('a').innerHTML.trim();
      });

      return list;
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
