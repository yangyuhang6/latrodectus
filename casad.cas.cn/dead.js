const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://casad.cas.cn/ysxx2022/ygys/');

  const container = await page.$('.rmbs_a');

  const data = await container.$$eval('a', nodes => nodes.map(n => {

    return {
      text: n.innerText,
      link: n.href,
    };
  }));

  console.log(data);

  await browser.close();
})();
