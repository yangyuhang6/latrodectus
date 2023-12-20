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

    await page.goto('https://yaocai.zyctd.com/');
    await page.waitForSelector('#ovh_pz', {
      timeout: 5000,
    });

    const data = await page.evaluate(() => {
      const ret = [];
      document.querySelectorAll('#ovh_pz > div').forEach((el, idx) => {
        ret[idx] = {};
        ret[idx].title = el.querySelector('a').innerHTML;
        Array.from(el.querySelectorAll('a')).splice(1).forEach(item => {
          if (!ret[idx].content) {
            ret[idx].content = [];
          }
          ret[idx].content.push(item.innerHTML);
        });
      });
      return ret;
    });

    print(data);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
