const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', req => {
    if (
      req.url().endsWith('.jpg') ||
      req.url().endsWith('.png') ||
      req.url().includes('.css')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('https://www.zyctd.com/data/ycgx.html');
    await page.waitForSelector('ul.jf-list > li', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const list = [];
      const lis = Array.from(document.querySelectorAll('ul.jf-list > li'));
      lis.forEach((el, idx) => {
        list[idx] = {};
        list[idx].name = el.querySelector('a').innerHTML.trim();
        list[idx].efficacy = el.textContent.trim();
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
