const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://www.zyctd.com/jiage/1-0-0.html');

  const container = await page.$('.priceTableRows');

  const data = await container.$$eval('li', nodes => nodes.map(n => {
    return {
      text: n.innerText.replaceAll('\n', ' '),
    };
  }));

  console.log(data);

  await browser.close();
})();
