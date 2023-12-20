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

    const targetId = '#SUBD1653293730026376';
    await page.goto('https://www.12371.cn/special/xxzd/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const bannerDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      const detail = Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        detail: el.innerHTML.trim(),
      }));

      return detail;
    });

    print(bannerDetail, bannerDetail.length);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
