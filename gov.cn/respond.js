const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.gov.cn/');

  await page.waitForSelector('#index_hygq');

  const text = await page.evaluate(() => {
    return Array.from(window.document.querySelector('#index_hygq').children[1].querySelectorAll('a')).map(el => ({
      href: el.href,
      text: el.innerHTML.trim(),
    }));
  });

  print(text);
  await page.close();
  await browser.close();
})();
