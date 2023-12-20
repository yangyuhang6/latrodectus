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
    await page.waitForSelector('.n-menu', {
      timeout: 5000,
    });

    const href = await page.evaluate(() => {
      return document.querySelector('.n-menu > li:nth-child(1) > div:nth-child(1) > span:nth-child(3) > a').href;
    });

    await page.goto(href);
    await page.waitForSelector('.zixun-list', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      const produce = document.querySelectorAll('.zixun-list > div');
      produce.forEach((el, idx) => {
        list[idx] = {};
        list[idx].title = el.querySelector('div:nth-child(1) a > span').innerHTML;
        list[idx].time = el.querySelector('div:nth-child(3) > span:nth-child(1)').innerHTML;
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
