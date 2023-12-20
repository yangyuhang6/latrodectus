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

    const targetId = '.right_md_list';
    await page.goto('https://www.cae.cn/cae/html/main/col104/column_104_1.html');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const academician = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('body > div.mdbg > div > div.right_md > div > div.right_md_list > ul > li:nth-child(2) > a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(academician, academician.length);

    await page.goto(academician[0].href);

    await page.waitForSelector('.right_md_text', {
      timeout: 5000,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('#zoom > p:nth-child(1)').innerHTML;
    });

    print(introduce);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
