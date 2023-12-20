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

    const targetClass = '.page-wrap';
    await page.goto('https://www.fortunechina.com/zhuanlan/node_12602.htm');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    const title = await page.title();
    print(title);

    const container = await page.$(targetClass);
    const detail = await container.$$eval('.home-main .info a', options => {
      return options.map(el => ({
        href: el.href,
        name: el.querySelector('span').innerHTML.trim(),
        recommend: el.querySelector('div:nth-child(2)').innerHTML.trim(),
      }));
    });

    print(detail, detail.length);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
