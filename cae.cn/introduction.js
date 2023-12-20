const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetId = '.right_md_list';
    await page.goto('https://www.cae.cn/cae/html/main/col140/column_140_1.html');
    await page.waitForSelector(targetId, {
      timeout: 5000,
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

    await page.waitForSelector('.right_md_text', {
      timeout: 500,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('#zoom > p:nth-child(5)').innerHTML;
    });

    print(introduce);
  } catch (e) {
    print(e.length);
  }

  await page.close();
  await browser.close();
})();
