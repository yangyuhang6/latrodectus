const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetId = '#allNameBar';
    await page.goto('https://casad.cas.cn/ysxx2022/ysmd/qtys/');
    await page.waitForSelector(targetId, {
      timeout: 500,
    });

    await page.exposeFunction('targetId', () => targetId);

    const academician = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.children[0].children[1].querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(academician, academician.length);

    await page.goto(academician[0].href);

    await page.waitForSelector('.acadTxt', {
      timeout: 500,
    });

    const introduce = await page.evaluate(async () => {
      return document.querySelector('#zoom > div.acadTxt > p:nth-child(2)').innerHTML;
    });

    print(introduce);

    await page.screenshot({ path: 'screenshot.png' });

  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
