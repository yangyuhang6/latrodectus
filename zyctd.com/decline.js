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
    const target = '.mb30';
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector('.mb30', {
      timeout: 5000,
    });

    await page.exposeFunction('target', () => target);

    const data = await page.evaluate(async () => {
      const detail = [];
      const box = document.querySelectorAll(await target())[1];

      Array.from(box.querySelectorAll('.w1 > a')).forEach((el, index) => {
        detail[index] = {};
        detail[index].name = el.innerHTML;
      });

      Array.from(box.querySelectorAll('.w5 > em')).forEach((el, index) => {
        detail[index].decline = el.innerHTML;
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
