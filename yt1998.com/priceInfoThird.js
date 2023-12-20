const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setRequestInterception(true);
  page.on('request', req => {
    if (
      req.url().endsWith('.jpg') ||
      req.url().endsWith('.png') ||
      req.url().includes('.css')
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  try {
    await page.goto('https://www.yt1998.com/priceInfo.html');
    await page.waitForSelector('#priceList', {
      timeout: 5000,
    });

    const data = await page.evaluate(async () => {
      const arr = [];
      const tr = Array.from(document.querySelectorAll('#priceList > tr'));
      tr.splice(1);
      tr.forEach((el, idx) => {
        arr[idx] = {};
        arr[idx].name = el.querySelector('td:nth-child(1) a').innerHTML;
        arr[idx].address = el.querySelector('td:nth-child(3) font').innerHTML;
        arr[idx].price = el.querySelector('td:nth-child(4) font').innerHTML;
      });
      return arr;
    });
    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
