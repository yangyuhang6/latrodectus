const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const target = '.n-menu';
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector(target, {
      timeout: 5000,
    });

    const infoHref = await page.$eval('.n-menu > li:nth-child(4) > div:nth-child(1) > span:nth-child(3) a', el => el.href);
    print(infoHref);
    await page.goto(infoHref);
    await page.waitForSelector('#search-result1', {
      timeout: 5000,
    });

    const data = await page.$$eval('#search-result1 li', options => {
      const list = [];
      options.forEach((el, idx) => {
        list[idx] = {};
        list[idx].name = el.querySelector('.item-name').innerHTML;
        list[idx].product = el.querySelector('.item-product').innerHTML;
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
