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
    await page.goto('https://store-sell.kakao.com/', 'networkidle0');
    await page.waitFor(3000);
    await page.click('#mArticle > div > div.start_btn > a.btn_start.btn_login');
    await page.waitFor(10000);
    await page.focus('#loginEmail');
    await page.keyboard.type('cwuncle@naver.com');
    await page.focus('#loginPw');
    await page.keyboard.type('hwa30102@@');
    await page.click('#login-form > fieldset > button');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    await page.mouse.click(1.0, 1.0);
    await page.waitFor(3000);
    await page.waitForSelector('#mArticle > div > div:nth-child(2) > wf-view-dashboard-shipping > div > div > ul > li:nth-child(1) > a > span')
    const newOrderElement = await page.$('#mArticle > div > div:nth-child(2) > wf-view-dashboard-shipping > div > div > ul > li:nth-child(1) > a > span')
    const newOrder = await page.evaluate(newOrderElement => newOrderElement.textContent, newOrderElement)
    console.log(typeof(newOrder))
    await newOrderElement.dispose()
    if(newOrder !== '0') {
      await page.click('#mArticle > div > div:nth-child(2) > wf-view-dashboard-shipping > div > div > ul > li:nth-child(1) > a');
      await page.waitForNavigation('networkidle0');
      await page.waitFor(3000)
      await page.click('#exportExcel_channelItem');
    } else if(newOrder === '0') {
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