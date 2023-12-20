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

    const targetClass = 'div.fn-header-right-top > ul > li:nth-child(2)';
    await page.goto('https://www.fortunechina.com/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    const container = await page.$(targetClass);
    const href = await container.$eval('a', el => { return el.href; });
    await page.goto(href);

    const title = await page.title();
    print(title);

    const tarClass = '.home-main';
    await page.waitForSelector(tarClass, {
      timeout: 5000,
    });

    const containerSy = await page.$(tarClass);
    const detail = await containerSy.$$eval('a', options => {
      return options.map(el => ({
        href: el.href,
        text: el.innerHTML.trim(),
      }));
    });

    print(detail, detail.length);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
