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

    const targetClass = '.home-main';
    await page.goto('https://www.fortunechina.com/rankings/node_11663.htm');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const rankings = await page.evaluate(async () => {
      const container = document.querySelector(await targetClass());

      if (container === null) {
        throw new Error(`${container} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        detail: el.innerHTML.trim(),
      }));
    });

    print(rankings, rankings.length);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
