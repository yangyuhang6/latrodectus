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

    const targetId = '#SUBD1653292250140301';
    await page.goto('https://www.12371.cn/special/xxzd/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const reviewDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      const detail = Array.from(container.querySelectorAll('ul li')).map(el => ({
        href: el.querySelector('a').href,
        detail: el.querySelector('a').innerHTML.trim(),
      }));

      return detail;
    });

    print(reviewDetail);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
