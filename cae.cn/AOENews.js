const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetId = '.gy_gwy_news';
    await page.goto('https://www.cae.cn/');
    await page.waitForSelector(targetId, {
      timeout: 500,
    });

    await page.exposeFunction('targetId', () => targetId);

    const academician = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(academician, academician.length);

    await page.goto(academician[0].href);

    await page.waitForSelector('.right_md_laiy', {
      timeout: 500,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('.right_md_laiy').children[0].innerHTML;
    });

    print(introduce);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
