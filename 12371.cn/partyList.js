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

    const targetId = '.dang_list_top';
    await page.goto('https://www.12371.cn/2023/06/30/ARTI1688112230122252.shtml');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const partyList = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(partyList, partyList.length);

    await page.goto(partyList[3].href);

    await page.waitForSelector('.dyw840_by_byfc', {
      timeout: 5000,
    });

    const person = await page.evaluate(async () => {
      return document.querySelector('#SUBD1541643505241143 > div:nth-child(15) > div.dyw840_by_byfc_img > ul > li:nth-child(3) > p > a').innerHTML;
    });

    print(person);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
