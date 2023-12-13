const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (
      interceptedRequest.url().endsWith('.png') ||
      interceptedRequest.url().endsWith('.jpg') ||
      interceptedRequest.url().includes('.css')) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  try {
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('#keyword', {
      timeout: 5000,
    });

    await page.type('#keyword', '人参');
    await page.click('#sub_search');
    await page.waitForSelector('.priceTableRows', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const ul = document.querySelector('.priceTableRows');
      const detail = [];

      Array.from(ul.querySelectorAll('.w1 > a')).forEach((el, index) => {
        detail[index] = {};
        detail[index].name = el.innerHTML;
      });

      Array.from(ul.querySelectorAll('.w2 > a')).forEach((el, index) => {
        detail[index].specification = el.innerHTML;
      });

      Array.from(ul.querySelectorAll('.w9')).forEach((el, index) => {
        detail[index].address = el.innerHTML;
      });

      return detail;
    });

    print(data);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  browser.close();
})();
