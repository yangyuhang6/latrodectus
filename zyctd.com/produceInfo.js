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
    await page.goto('https://www.zyctd.com/gqcd/');
    await page.waitForSelector('#listTab', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const list = [];
      document.querySelectorAll('#listTab > tbody > tr').forEach((el, idx) => {
        list[idx] = {};
        list[idx].name = el.querySelector('td:nth-child(1)').innerHTML.trim();
        list[idx].Specification = el.querySelector('td:nth-child(2)').innerHTML.trim();
        list[idx].num = el.querySelector('td:nth-child(3)').innerHTML.trim();
        list[idx].price = el.querySelector('td:nth-child(4)').innerHTML.trim();
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
