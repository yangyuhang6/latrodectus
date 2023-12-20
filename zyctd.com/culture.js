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
      interceptedRequest.url().includes('.css')
    ) {
      interceptedRequest.abort();
    } else {
      interceptedRequest.continue();
    }
  });

  try {
    await page.goto('https://www.zyctd.com/wenhua/');
    await page.waitForSelector('.zixun-list', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const detail = [];
      document.querySelectorAll('.zixun-list> div').forEach((el, index) => {
        detail[index] = {};
        detail[index].type = el.querySelector('.zixun-item-title span:first-child').innerHTML;
        detail[index].title = el.querySelector('.zixun-item-title span:last-child').innerHTML;
        detail[index].name = el.querySelector('.zixun-item-footer span:first-child').innerHTML;
      });

      return detail;
    });

    print(data);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
