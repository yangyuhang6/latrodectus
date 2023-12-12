const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://casad.cas.cn/ysxx2022/wjys/');

    await page.waitForSelector('.rmbs_a', {
      timeout: 5000,
    });

    const text = await page.evaluate(() => {
      const container = document.querySelector('.rmbs_a').querySelectorAll('a');
      if (!container) throw new Error('not exist');

      return Array.from(container).map(el => ({
        href: el.href,
        text: el.innerHTML.trim(),
      }));
    });

    print(text);
  } catch (e) {
    print(e);
  }

  await page.close();
  await browser.close();
})();
