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
    await page.waitForSelector('#txtPagepageCute', {
      timeout: 5000,
    });
    const list = [];

    for (let i = 100; i <= 103; i++) {
      await page.type('#txtPagepageCute', i.toString());
      await page.click('.pageBreak > div:last-child input');
      await page.waitForSelector('.priceTableRows', {
        timeout: 5000,
      });

      const data = await page.evaluate(() => {
        const ret = [];
        document.querySelectorAll('.priceTableRows > li').forEach((el, idx) => {
          ret[idx] = {};
          ret[idx].name = el.querySelector('.w1 a').innerHTML;
          ret[idx].price = el.querySelector('.w3').innerHTML;
        });
        return ret;
      });
      list.push(data);
    }
    print(list);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
