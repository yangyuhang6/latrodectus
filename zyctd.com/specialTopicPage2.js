const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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

  try {
    await page.goto('https://www.zyctd.com/zt/');
    await page.waitForSelector('#pagerDom > div.pageBreak > div:nth-child(5) > a', {
      timeout: 5000,
    });
    await page.click('#pagerDom > div.pageBreak > div:nth-child(5) > a');

    await page.waitForSelector('#pushList', {
      timeout: 5000,
    });
    const detail = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#pushList > li')).map(el => {
        return {
          href: el.querySelector('p a').href,
          title: el.querySelector('p a').innerHTML,
        };
      });
    });

    print(detail);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
