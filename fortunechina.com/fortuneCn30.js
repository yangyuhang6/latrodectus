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

    const targetClass = '.wt-table';
    await page.goto('https://www.fortunechina.com/fortune500/c/2021-07/20/content_392708.htm');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const fortuneCn30 = await page.evaluate(async () => {
      const container = document.querySelector(await targetClass());

      if (container === null) {
        throw new Error(`${targetClass()} is not exists`);
      }

      const companyInformation = [];

      Array.from(container.children[1].querySelectorAll('a')).forEach((el, index) => {
        companyInformation[index] = {};
        companyInformation[index].href = el.href;
        companyInformation[index].companyName = el.innerHTML.trim();
      });

      Array.from(container.querySelectorAll('#table1 > tbody > tr > td:nth-child(4)')).forEach((el, index) => {
        companyInformation[index].income = el.innerHTML.trim();
      });

      Array.from(container.querySelectorAll('#table1 > tbody > tr > td:nth-child(5)')).forEach((el, index) => {
        companyInformation[index].profit = el.innerHTML.trim();
      });

      return companyInformation;
    });

    print(fortuneCn30, fortuneCn30.length);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
