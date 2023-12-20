const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
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

    const targetId = '#SUBD1663207184247935';
    await page.goto('https://www.12371.cn/special/zzjhy/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    const container = await page.$(targetId);

    if (container === null) {
      throw new Error(`${targetId} is not exists`);
    }

    const href = await container.$eval('a', el => el.href);

    await page.goto(href);

    const title = await page.title();
    print(title);

    const targetClass = '.dang_list_top';
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    const containerDet = await page.$(targetClass);

    const detail = await containerDet.$$eval('a', options => {
      return options.map(el => ({
        href: el.href,
        text: el.innerHTML.trim(),
      }));
    });

    print(detail, detail.length);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
