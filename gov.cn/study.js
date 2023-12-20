const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetID = '.word-text-con';
    await page.goto('https://www.fortunechina.com/fortune500/c/2023-08/02/content_436884.htm');
    await page.waitForSelector(targetID, {
      timeout: 5000,
    });

    await page.exposeFunction('targetID', () => targetID);

    const news = await page.evaluate(async () => {
      const contatiner = document.querySelector(await targetID());

      if (contatiner === null) {
        throw new Error(`div${await targetID()} not exists`);
      }

      return Array.from(contatiner.querySelectorAll('p')).map(anchor => ({
        text: anchor.innerHTML.trim(),
      }));
    });

    print(news, news.length);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
