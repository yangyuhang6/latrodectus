/* eslint-disable no-constant-condition */
const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const brower = await puppeteer.launch();
  const page = await brower.newPage();

  try {
    await page.setRequestInterception(true);
    page.on('request', req => {
      if (
        req.url().endsWith('.png') ||
        req.url().endsWith('.jpg') ||
        req.url().includes('.css')
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const tagetClass = '.ELMT1614757865419868';
    await page.goto('https://www.12371.cn/dsxx/pl/');
    await page.waitForSelector(tagetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('tagetClass', () => tagetClass);

    const mediaCommentsDetail = [];

    while (true) {
      const detail = await page.evaluate(async () => {
        const container = document.querySelector(await tagetClass());

        if (container === null) throw new Error(`${tagetClass} is not exists`);

        return Array.from(container.querySelectorAll('ul a')).map(el => ({
          href: el.href,
          text: el.innerHTML.trim(),
        }));
      });

      mediaCommentsDetail.push(...detail);

      if (await page.$('#fenye0ELMT1614757865419868 .tpb_btn_previous:nth-last-child(2)') === null) break;
      await page.click('#fenye0ELMT1614757865419868 .tpb_btn_previous:nth-last-child(2)');
      await page.waitForSelector('.dyw5210_three_listtext', {
        timeout: 5000,
      });
    }

    print(mediaCommentsDetail, mediaCommentsDetail.length);
  } catch (e) {
    print(e.mesage);
  }

  await page.close();
  await brower.close();
})();
