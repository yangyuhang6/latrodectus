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
    await page.waitForSelector('.rank-box', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const detail = [];
      document.querySelectorAll('.rank-box > ul > li').forEach((el, index) => {
        detail[index] = {};
        detail[index].num = el.querySelector('span').innerHTML;
        detail[index].title = el.querySelector('a').innerHTML;
      });

      return detail;
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
