const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://www.fortunechina.com/fortune500/node_65.htm');

    await page.waitForSelector('.fn-header-right-top', {
      timeout: 5000,
    });

    await page.screenshot({ path: 'screenshots/fortunechina_index.png' });

    const secienceHref = await page.evaluate(() => {
      const secience = document.querySelector('.fn-header-right-top > ul > li:nth-child(3) > a');
      return secience.href;
    });
    print(secienceHref);
    await page.goto(secienceHref);

    await page.screenshot({ path: 'screenshots/fortunechina_secience.png' });

    await page.waitForSelector('.mod-list1', {
      timeout: 5000,
    });
    const data = await page.evaluate(() => {
      const content = document.querySelector('body > div.main > div.page-wrap > div > div.home-main > ul:nth-child(2)').querySelectorAll('a');
      return Array.from(content).map(el => ({
        href: el.href,
        name: el.innerHTML,
      }));
    });
    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
