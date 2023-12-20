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
    await page.goto('https://www.zyctd.com/gqcg/');
    await page.waitForSelector('.zixun-list', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const ret = [];
      document.querySelectorAll('.zixun-list > div').forEach((el, idx) => {
        ret[idx] = {};
        ret[idx].title = el.querySelector('.zixun-item-title span')?.innerHTML.trim();
        ret[idx].time = el.querySelector('.zixun-item-footer span:nth-child(1)')?.innerHTML.trim();
        ret[idx].breed = el.querySelector('.zixun-item-footer span:nth-child(3) > span > div a')?.innerHTML.trim();
        ret[idx].breed += ' ' + el.querySelector('.zixun-item-footer span:nth-child(3) > span > div:last-child a')?.innerHTML.trim();
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
