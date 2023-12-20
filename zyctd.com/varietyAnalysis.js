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
        req.url().endsWith('.jgp') ||
        req.url().includes('.css')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('.n-menu', {
      timeout: 5000,
    });

    const href = await page.$eval('.n-menu > li:nth-child(1) > div:nth-child(1) > span:nth-child(4) > a', el => el.href);
    await page.goto(href);
    await page.waitForSelector('.zixun-list', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      document.querySelectorAll('.zixun-list > div').forEach((el, idx) => {
        list[idx] = {};
        list[idx].title = el.querySelector('.zixun-item-title span').innerHTML.trim();
        list[idx].time = el.querySelector('.zixun-item-footer span:nth-child(1)').innerHTML.trim();
        list[idx].type = el.querySelector('.zixun-item-footer span:nth-child(3) .hover-mbs a').innerHTML.trim();
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
