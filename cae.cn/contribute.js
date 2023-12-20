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

    const targetId = '.whole.col-xs-6.col-sm-4.col-md-6.row';
    await page.goto('https://www.engineering.org.cn/ch/journal/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const academician = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('#journals > div > div.row > div:nth-child(1) > div.item-right.col-sm-12 > p.zuoce > span:nth-child(2)')).map(el => ({
        style: el.style,
        href: el.getAttribute('val'),
        name: el.innerHTML.trim(),
      }));
    });

    print(academician, academician.length);

    await page.goto(academician[0].href);

    await page.waitForSelector('#contentDiv', {
      timeout: 5000,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('a').innerHTML;
    });

    print('print: ' + introduce);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
