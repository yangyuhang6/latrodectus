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

    const targetId = '.dyw994_xxyt';
    await page.goto('https://www.12371.cn/dsxx/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const discuss = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(discuss, discuss.length);

    await page.goto(discuss[3].href);

    await page.waitForSelector('.word', {
      timeout: 5000,
    });

    const person = await page.evaluate(async () => {
      return document.querySelector('#font_area > div > div > p:nth-child(2) > strong > a').innerHTML.trim();
    });

    print(person);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
