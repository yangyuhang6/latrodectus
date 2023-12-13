const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetId = '.right_md_ysmd';
    await page.goto('https://www.cae.cn/cae/html/main/col53/column_53_1.html');
    await page.waitForSelector(targetId, {
      timeout: 500,
    });

    await page.exposeFunction('targetId', () => targetId);

    const academician = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.children[1].querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(academician, academician.length);

    await page.goto(academician[0].href);

    await page.waitForSelector('.intro', {
      timeout: 500,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('p').innerHTML;
    });

    print(introduce);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
