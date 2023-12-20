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
        interceptedRequest.url().includes('.css')
      ) {
        interceptedRequest.abort();
      } else {
        interceptedRequest.continue();
      }
    });

    const targetId = '.right_md';
    await page.goto('https://www.cae.cn/cae/html/main/col48/column_48_1.html');
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

    const arr = [];
    for (let i = 31, j = 0; i < academician.length - 1; i++) {
      await page.goto(academician[i].href);

      print(`${i}: ${academician[i].name}`);

      const introduce = await page.evaluate(async () => {
        return Array.from(document.querySelectorAll('p:nth-child(1)')).map(el => ({
          name: el.innerHTML.trim(),
        }));
      });

      if (introduce[0].name.includes('浙江')) {
        arr[j] = academician[i].name;
        j += 1;

        print(`${academician[i].name} 是浙江籍 ${arr}`);
      }

      continue;
    }

    print('Search for the end!');
  } catch (e) {
    print(e.message);
  }

  await page.close();
  await browser.close();
})();
