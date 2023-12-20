const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetID = '.rmbs_a';
    await page.goto('https://casad.cas.cn/ysxx2022/ysmd/qtys/');
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
