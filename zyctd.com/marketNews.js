const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', req => {
    if (
      req.url().endsWith('.jpg') ||
      req.url().endsWith('.png') ||
      req.url().includes('.css')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('.n-menu', {
      timeout: 5000,
    });

    const href = await page.evaluate(async () => {
      return document.querySelector('.n-menu > li:nth-child(1) > div:nth-child(1) > span:nth-child(2) > a').href;
    });

    await page.goto(href);
    await page.waitForSelector('.zixun-list', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      const li = document.querySelectorAll('.zixun-list > div');
      li.forEach((el, idx) => {
        list[idx] = {};
        list[idx].title = el.querySelector('.zixun-item-title span').innerHTML;
        list[idx].time = el.querySelector('.zixun-item-footer span:nth-child(1)').innerHTML;
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
