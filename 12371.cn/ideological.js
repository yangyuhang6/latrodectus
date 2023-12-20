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

    const targetClass = '.dyw638_two_imglist';
    await page.goto('https://www.12371.cn/special/sxll/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const booksDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetClass());

      if (container === null) {
        throw new Error(`${targetClass} is not exists`);
      }

      const detail = Array.from(container.querySelectorAll('li > p:nth-child(3)')).map(el => ({
        href: el.href,
        booksName: el.innerHTML.trim(),
      }));

      return detail;
    });

    print(booksDetail, booksDetail.length);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
