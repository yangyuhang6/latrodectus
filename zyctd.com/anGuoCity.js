const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
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

  try {
    const target = '#DrugMarket_div';
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector(target, {
      timeout: 3000,
    });

    await page.exposeFunction('target', () => target);

    const href = await page.evaluate(async () => {
      const box = document.querySelector(await target());
      return box.querySelector('a:nth-child(1)').href;
    });

    await page.goto(href);
    await page.waitForSelector('.priceTableRows', {
      timeout: 3000,
    });

    const data = await page.evaluate(async () => {
      const dataList = [];

      document.querySelectorAll('.priceTableRows .w1 > a').forEach((el, index) => {
        dataList[index] = {};
        dataList[index].name = el.innerHTML;
      });

      document.querySelectorAll('.priceTableRows .w9').forEach((el, index) => {
        dataList[index].market = el.innerHTML;
      });

      document.querySelectorAll('.priceTableRows .w3').forEach((el, index) => {
        dataList[index].price = el.innerHTML;
      });

      return dataList;
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
