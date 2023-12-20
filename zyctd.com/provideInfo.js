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

    await page.goto('https://www.zyctd.com/gqgy/');
    await page.waitForSelector('.supply_list_box', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const list = [];
      document.querySelectorAll('.supply_list_box > ul > li').forEach((el, idx) => {
        list[idx] = {};
        list[idx].name = el.querySelector('.sulist_title a')?.innerHTML;
        list[idx].Specification = el.querySelector('ul > li:first-child > div span')?.innerHTML;
        list[idx].num = el.querySelector('ul > li:nth-child(2) span')?.innerHTML;
        list[idx].time = el.querySelector('ul > li:nth-child(3) > div:last-child span')?.innerHTML;
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
