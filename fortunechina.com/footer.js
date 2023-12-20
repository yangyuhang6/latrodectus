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

    const targetClass = '.footer .fd-top';
    await page.goto('https://www.fortunechina.com/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    const container = await page.$(targetClass);

    if (container === null) {
      throw new Error(`${targetClass} is not exists`);
    }

    const detail = await container.$$eval('.fd-nav a', options => {
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
