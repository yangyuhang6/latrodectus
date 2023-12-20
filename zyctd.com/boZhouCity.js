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
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('#DrugMarket_div', {
      timeout: 5000,
    });

    const href = await page.evaluate(async () => {
      const box = document.querySelector('#DrugMarket_div');
      return box.querySelector('a:nth-child(2)').href;
    });

    await page.goto(href);
    await page.waitForSelector('.priceTableRows', {
      timeout: 3000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      document.querySelectorAll('.priceTableRows li').forEach((el, index) => {
        list[index] = {};
        list[index].name = el.querySelector('.w1 > a').innerHTML.trim();
        list[index].market = el.querySelector('.w9').innerHTML.trim();
        list[index].price = el.querySelector('.w3').innerHTML.trim();
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
