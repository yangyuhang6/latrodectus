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

    await page.goto('https://www.zyctd.com/cunchu');
    await page.waitForSelector('.search-box-select', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const lis = Array.from(document.querySelectorAll('.search-box-select')[2].querySelectorAll('a'));
      return lis.map(el => {
        return {
          href: el.href.trim(),
          title: el.innerHTML.trim(),
        };
      });
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
