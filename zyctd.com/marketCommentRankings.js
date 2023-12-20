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

    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('.n-menu', {
      timeout: 5000,
    });

    const href = await page.$eval('.n-menu > li:nth-child(1) > div:nth-child(1) > span:nth-child(5) > a', el => el.href);
    await page.goto(href);
    await page.waitForSelector('.rank-box', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('.rank-box > ul > li').forEach((el, index) => {
        list[index] = {};
        list[index].title = el.querySelector('a').innerHTML;
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
