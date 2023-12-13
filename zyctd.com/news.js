const { launch } = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await launch();
  const page = await browser.newPage();

  try {
    const targetID = '.txtlist';
    await page.goto('https://www.zyctd.com/jiage/1-0-0.html');
    await page.waitForSelector(targetID, {
      timeout: 5000,
    });

    await page.exposeFunction('targetID', () => targetID);

    const news = await page.evaluate(async () => {
      const container = document.querySelector(await targetID());

      if (container === null) {
        throw new Error(`div${await targetID()} not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(anchor => ({
        href: anchor.href,
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
