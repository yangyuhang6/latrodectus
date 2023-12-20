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

    const targetId = '.footer_links.footer_links1';
    await page.goto('https://www.gov.cn/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const link = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(link, link.length);

    await page.goto(link[3].href);

    await page.waitForSelector('.focus_news', {
      timeout: 5000,
    });

    const newsList = await page.evaluate(async () => {
      return document.querySelector('#container > div:nth-child(6) > div.fr.right > div.focus_news').innerHTML;
    });

    print(newsList);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
