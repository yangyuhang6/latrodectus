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

    const tagetClass = '.ELMT1655861789724657';
    await page.goto('https://www.12371.cn/special/dnfg/zz/');
    await page.waitForSelector(tagetClass, {
      timeout: 5000,
    });

    await page.exposeFunction('tagetClass', () => tagetClass);

    const guidelineDetail = await page.evaluate(async () => {
      const container = document.querySelector(await tagetClass());

      if (container === null) throw new Error(`${tagetClass} is not exists`);

      const detail = Array.from(container.querySelectorAll('ul li')).map(el => ({
        titleHref: el.querySelector('.title a').href,
        titleDetail: el.querySelector('.title a').innerHTML.trim(),
        text: Array.from(el.querySelectorAll('.text a')).map(ele => ({
          textHref: ele.href,
          textDetail: ele.innerHTML.trim(),
        })),
      }));

      return detail;
    });

    print(guidelineDetail, guidelineDetail.length, guidelineDetail[0].text);
  } catch (e) {
    print(e.mesage);
  }

  await page.close();
  await brower.close();
})();
