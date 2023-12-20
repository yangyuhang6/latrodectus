/* eslint-disable no-constant-condition */
const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

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

    const targetClass = '.ELMT1614584658697358';
    await page.goto('https://www.12371.cn/dsxx/wsx/');
    await page.waitForSelector(targetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('targetClass', () => targetClass);

    const studyDiscussionDetail = [];

    while (true) {
      const detail = await page.evaluate(async () => {
        const container = document.querySelector(await targetClass());

        if (container === null) throw new Error(`${targetClass} is not exists`);

        return Array.from(container.querySelectorAll('ul a')).map(el => ({
          href: el.href,
          detail: el.textContent.trim(),
        }));
      });

      studyDiscussionDetail.push(...detail);

      if (await page.$('.turn_page_box_5210 .tpb_btn_previous:nth-last-child(2)') === null) break;
      await page.click('.turn_page_box_5210 .tpb_btn_previous:nth-last-child(2)');
      await page.waitForSelector('.dyw5210_three_listtext', {
        timeout: 5000,
      });
    }

    print(studyDiscussionDetail, studyDiscussionDetail.length);
  } catch (e) {
    print(e.message);
  }

  page.close();
  browser.close();
})();
