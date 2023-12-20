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
    await page.goto('https://www.zyctd.com/data/yqxx.html');
    await page.waitForSelector('.chart-table-body > tr', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const ret = [];
      document.querySelectorAll('.chart-table-body > tr').forEach((el, idx) => {
        ret[idx] = {};
        ret[idx].name = el.querySelector('td').innerHTML.trim();
        ret[idx].product = el.querySelector('td:nth-child(4)').innerHTML.trim();
      });

      return ret;
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
