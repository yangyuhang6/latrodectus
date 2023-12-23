const puppeteer = require('puppeteer');

const print = console.log;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const page = await browser.newPage();

  await page.goto('https://www.yt1998.com/priceInfo.html');

  const priceElementText = await page.evaluate(() => {
    return document.querySelector('#priceList > tr:nth-child(5) > td:nth-child(11) > em > a').innerHTML;
  });

  print(priceElementText);

  await page.screenshot({ path: 'screenshot/yt1998_index.png' });

  const container = await page.$('.type');

  print(container);

  const data = await container.$$eval('a', nodes => nodes.map(n => {
    return {
      text: n.innerText,
      link: n.title,
    };
  }));

  print(data);

  await browser.close();
})();
