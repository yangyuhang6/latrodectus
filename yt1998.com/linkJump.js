const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const targetClass = '.list';
    await page.goto('https://qxn.yt1998.com/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const findLink = await page.evaluate(async () => {
      const container = document.querySelectorAll(await targetClass())[1];

      if (container === null) {
        throw new Error(`${targetClass()} is not exists`);
      }
      return container.querySelector('li:nth-child(1) a').href;
    });

    print(findLink, findLink.length);

    await page.goto(findLink);

    await page.waitForSelector('.mt20', {
      timout: 5000,
    });
    await page.screenshot({ path: './screenshot/1988.png' });
    const introduce = await page.evaluate(async () => {
      return document.querySelectorAll('.mt20')[2].querySelector('p:nth-child(2)').innerHTML;
    });

    print(introduce);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
