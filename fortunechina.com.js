const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const page = await browser.newPage();

  await page.goto('https://www.fortunechina.com/fortune500/node_65.htm');

  const container = await page.$('.hci-dis');

  console.log(container);

  const data = await container.$$eval('a', nodes => nodes.map(n => {
    return {
      text: n.innerText,
      link: n.title,
    };
  }));

  console.log(data);

  await browser.close();
})();
