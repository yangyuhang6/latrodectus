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

    const tagetId = '#SUBD1608706599841177';
    await page.goto('https://www.12371.cn/special/dzby/');
    await page.waitForSelector(tagetId, {
      timeout: 5000,
    });

    await page.exposeFunction('tagetId', () => tagetId);

    const typicalColumnDetail = await page.evaluate(async () => {
      const container = document.querySelector(await tagetId());

      if (container === null) throw new Error(`${tagetId} is not exists`);

      const detail = Array.from(container.querySelectorAll('.dyw840_textL ul a')).map(el => ({
        href: el.href,
        text: el.innerHTML.trim(),
      }));

      return detail;
    });

    print(typicalColumnDetail, typicalColumnDetail.length);
  } catch (e) {
    print(e.mesage);
  }

  await page.close();
  await brower.close();
})();
