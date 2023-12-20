const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.setRequestInterception(true);
    page.on('request', interceptedRequest => {
      if (
        interceptedRequest.url().endsWith('.png') ||
        interceptedRequest.url().endsWith('.jpg') ||
        interceptedRequest.url().endsWith('.css')
      ) {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });

    const targetId = '.index_toutiao';
    await page.goto('https://www.gov.cn/');
    await page.waitForSelector(targetId, {
      timeout: 5000,
    });

    await page.exposeFunction('targetId', () => targetId);

    const instruction = await page.evaluate(async () => {
      const container = document.querySelector(await targetId());

      if (container === null) {
        throw new Error(`${targetId()} is not exists`);
      }

      return Array.from(container.querySelectorAll('a')).map(el => ({
        href: el.href,
        name: el.innerHTML.trim(),
      }));
    });

    print(instruction, instruction.length);

    await page.goto(instruction[0].href);

    await page.waitForSelector('.view.TRS_UEDITOR.trs_paper_default.trs_web', {
      timeout: 5000,
    });

    const content = await page.evaluate(async () => {
      return document.querySelector('#UCAP-CONTENT > div.view.TRS_UEDITOR.trs_paper_default.trs_web > p:nth-child(2)').innerHTML;
    });

    print(content);
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
