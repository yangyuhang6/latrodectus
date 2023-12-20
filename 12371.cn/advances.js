const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (
        req.url().endsWith('.png') ||
        req.url().endsWith('.jpg') ||
        req.url().includes('.css')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const targetClass = '.ELMT1620969053491707';
    await page.goto('https://www.12371.cn/dsxx/dt/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const advancesDetail = await page.evaluate(async () => {
      const container = document.querySelector(await targetClass());

      if (container === null) throw new Error(`${targetClass} is not exists`);

      const detail = Array.from(container.querySelectorAll('ul a')).map(el => ({
        href: el.href,
        text: el.innerHTML.trim(),
      }));

      return detail;
    });

    print(advancesDetail, advancesDetail.length);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
