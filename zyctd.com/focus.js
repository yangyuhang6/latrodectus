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
    await page.goto('https://www.zyctd.com/');
    await page.waitForSelector('.hot-art strong', {
      timeout: 5000,
    });
    await page.waitForSelector('.hot-art span', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const list = [];
      Array.from(document.querySelectorAll('.hot-art')).forEach((el, index) => {
        list[index] = {};
        list[index].title = el.querySelector('strong').innerHTML.trim();
        list[index].content = el.querySelector('span').innerHTML.trim();
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
