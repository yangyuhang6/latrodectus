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

    const href = await page.$eval('.n-menu > li:nth-child(2) > div:nth-child(1) > span:nth-child(6) a', el => el.href);
    print(href);

    await page.goto(href);
    await page.waitForSelector('.pricebox ', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      const lis = Array.from(document.querySelectorAll('.pricebox')[2].querySelectorAll('.changeBreed > li'));
      lis.splice(1).forEach((el, idx) => {
        list[idx] = {};
        list[idx].name = el.querySelector('span:nth-child(2) a').innerHTML;
        list[idx].price = el.querySelector('span:nth-child(5) em').innerHTML;
        list[idx].num = el.querySelector('span:nth-child(6) em').innerHTML;
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
