const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetId = '#table1_wrapper';
    await page.goto('https://www.fortunechina.com/fortune500/c/2023-08/02/content_436874.htm');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const fortune50 = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      const companyInformation = [];

      Array.from(container.children[2].children[1].querySelectorAll('a')).forEach((el, index) => {
        companyInformation[index] = {};
        companyInformation[index].href = el.href;
        companyInformation[index].companyName = el.innerHTML.trim();
      });

      Array.from(container.querySelectorAll('#table1 > tbody > tr > td:nth-child(5)')).forEach((el, index) => {
        companyInformation[index].companyAddress = el.innerHTML.trim();
      });

      return companyInformation;
    });

    print(fortune50, fortune50.length);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
