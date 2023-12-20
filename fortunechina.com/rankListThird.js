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

    const targetId = '.fiveH-con';
    await page.goto('https://www.fortunechina.com/rankings/node_11663.htm');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const rankList = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(rankList, rankList.length);

    await page.goto(rankList[6].href);

    await page.waitForSelector('#table1', {
      timeout: 5000,
    });

    const content = await page.evaluate(async () => {
      return document.querySelector('#table1 > tbody > tr:nth-child(2) > td:nth-child(2) > a').innerHTML.trim();
    });

    print(content);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
