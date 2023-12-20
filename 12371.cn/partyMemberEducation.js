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

    const targetClass = '.dyw1018_dyjy';
    await page.goto('https://www.12371.cn/special/xxzd/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const partyMemberEducationDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetClass());

      if (container === null) {
        throw new Error(`${targetClass()} is not exists`);
      }

      const detail = Array.from(container.querySelectorAll('ul li')).map(el => ({
        href: el.querySelector('a').href,
        detail: el.querySelector('a').children[0].innerHTML.trim(),
        title: el.querySelector('a').children[1].innerHTML.trim(),
      }));

      return detail;
    });

    print(partyMemberEducationDetail);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
