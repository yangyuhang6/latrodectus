const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetID = '.rank';
    await page.goto('https://www.yt1998.com/supplyInfo.html');
    await page.waitForSelector(targetID, {
      timeout: 5000,
    });

    await page.exposeFunction('targetID', () => targetID);

    const news = await page.evaluate(async () => {
      const container = document.querySelectorAll(await targetID())[1];

      if (container === null) {
        throw new Error(`div${await targetID()} not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(anchor => ({
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
