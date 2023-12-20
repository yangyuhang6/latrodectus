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
    await page.goto('https://www.zyctd.com/jiage/');
    await page.waitForSelector('.n-menu', {
      timeout: 5000,
    });

    const href = await page.$eval('.n-menu > li:nth-child(2) > div:nth-child(1) > span:nth-child(6) a', el => el.href);
    print(href);

    await page.goto(href);
    await page.waitForSelector('.f.f1', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      document.querySelectorAll('.f.f1 .priceTableRows > li').forEach((el, idx) => {
        list[idx] = {};
        list[idx].name = el.querySelector('.w1 a').innerHTML;
        list[idx].type = el.querySelector('.w2 a').innerHTML;
        list[idx].Trend = el.querySelector('.w5 em').innerHTML;
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
