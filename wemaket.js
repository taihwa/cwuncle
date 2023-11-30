const puppeteer = require('puppeteer');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('underscore');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1980, height: 1280 },
  });
  const page = await browser.newPage();
  page.on('dialog', async (dialog) => {
    console.log('팝업듬');
    await dialog.accept();
  });
  try {
    await page.goto('https://wpartner.wemakeprice.com/login', 'networkidle0');
    await page.waitFor(3000);
    await page.focus('body > div.login_all_wrap > div.login_wrap > div > div.input_idpw > span.input_id > input[type=text]');
    await page.keyboard.type('cwuncle');
    await page.focus('body > div.login_all_wrap > div.login_wrap > div > div.input_idpw > span.input_pw > input[type=password]');
    await page.keyboard.type('hwa30102##');
    await page.click('#login');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    await page.$$eval('.main-layer-popup', mainPopups => mainPopups.forEach( popup => popup.style.display = 'none'));
    const frames = await page.frames();
    const frame = frames.find(frame => frame.url().includes('dashboard'));
    await frame.waitForSelector('#bodyContentsArea > div.main_container > div > div.condition-wrap > div:nth-child(1) > ul > li:nth-child(2) > a')
    const newOrderElement = await frame.$('#bodyContentsArea > div.main_container > div > div.condition-wrap > div:nth-child(1) > ul > li:nth-child(2) > a')
    const newOrder = await frame.evaluate(newOrderElement => newOrderElement.textContent, newOrderElement)
    await newOrderElement.dispose()
    if(newOrder.trim() !== '0') {
      await frame.click('#bodyContentsArea > div.main_container > div > div.condition-wrap > div:nth-child(1) > ul > li:nth-child(2) > a');
      await frame.waitForNavigation('networkidle0');
      await page.waitFor(3000)
      const frames1 = await page.frames();
      const orderFrame = frames1.find(frame => frame.url().includes('orderMain'));
      await frames1.click('#excelDownloadOrderInfoSrchAllBtn');
    } else if(newOrder.trim() === '0') {
      await browser.close();
    }
    /*const newOrder = await page.evaluate(() => {
      let cnt = document.querySelector('#mArticle > div > div:nth-child(2) > wf-view-dashboard-shipping > div > div > ul > li:nth-child(1) > a > span')
      console.log(cnt)
    })
    console.log(newOrder)
    await newOrderFrame.waitFor(50000);
    const dir = 'C:\\Users\\Tae-Hwa\\Downloads\\';
    const files = await fs.readdirSync(dir);
    const recentFile = await _.max(files, (f) => {
      const fullpath = path.join(dir, f);
      return fs.statSync(fullpath).ctime;
    });
    const latestFilePath = path.join(dir, recentFile);
    const buf = await fs.readFileSync(latestFilePath);
    const wb = xlsx.read(buf, { type: 'buffer' });
    const sheet = wb.SheetNames[0];
    const sheetToJson = xlsx.utils.sheet_to_json(wb.Sheets[sheet], { range: 1 });
    console.log(sheetToJson)
    await browser.close();
    */
  } catch (error) {
    console.log(error);
  }
})();