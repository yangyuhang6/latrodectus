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

    await page.exposeFunction('targetId', () => targetId);

    const conferenceDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      const detail = Array.from(container.children[1].querySelectorAll('li')).map(el => ({
        time: el.querySelector('span').innerHTML.trim(),
        href: el.querySelector('a').href,
        summary: el.querySelector('a').innerHTML.trim(),
      }));

      return detail;
    });

    print(conferenceDetail, conferenceDetail.length);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
