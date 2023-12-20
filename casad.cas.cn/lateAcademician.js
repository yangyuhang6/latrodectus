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

    const targetId = '.rmbs_a';
    await page.goto('https://casad.cas.cn/ysxx2022/ygys/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const lateAcademician = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(lateAcademician, lateAcademician.length);

    await page.goto(lateAcademician[0].href);

    await page.waitForSelector('.acadTxt', {
      timeout: 5000,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('#zoom > div.acadTxt > p:nth-child(2)').innerHTML;
    });

    print(introduce);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
