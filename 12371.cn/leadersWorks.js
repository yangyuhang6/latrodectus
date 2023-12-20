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

    const targetClass = '.dyw638_three_listtext';
    await page.goto('https://www.12371.cn/special/sxll/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const leadersWorksDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetClass());

      if (container === null) {
        throw new Error(`${targetClass} is not exists`);
      }

      const detail = Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        detail: el.innerHTML.trim(),
      }));

      return detail;
    });

    print(leadersWorksDetail, leadersWorksDetail.length);
  } catch (e) {
    print(e.messgae);
  }

  page.close();
  browser.close();
})();
