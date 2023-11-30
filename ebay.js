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
    console.log('dialog');
    await dialog.accept();
  });
  try {
    await page.goto('https://www.esmplus.com/Member/SignIn/LogOn', 'networkidle0');
    await page.waitFor(3000);
    await page.click('#Id');
    await page.keyboard.type('cwuncle');
    await page.click('#Password');
    await page.keyboard.type('hwa30102##');
    await page.click('#btnLogOn');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    const pages = await browser.pages();
    pages.forEach((page) => {
      if (page.url().includes('Popup')) {
        page.close();
      }
    });

    const mainFrame = await page.frames().find(f => f.name() === 'ifm_contents');
    const newOrderElement = await mainFrame.$('#Pay')
    const newOrder = await mainFrame.evaluate(newOrderElement => newOrderElement.textContent, newOrderElement)
    await newOrderElement.dispose()
    if(newOrder !== '0') {
      await page.click('#TDM002 > a');
      await page.waitFor(3000);
      await page.click('#TDM105 > a');
      await page.waitFor(3000);
      await page.waitForSelector('#iTDM105');
      const frame = await page.frames().find(f => f.name() === 'ifm_TDM105');
      await frame.waitForSelector('#gridPanel');
      await frame.click('#excelDown');
      const confirmPopup = await browser.waitForTarget(target => target.url() === 'https://www.esmplus.com/Escrow/Popup/ExecelSplitDownLoad');
      const popupPages = await browser.pages();
      const popup = popupPages[pages.length - 1];
      await popup.click('#popContents > div > a:nth-child(1)');
      await page.waitFor(10000);
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
      console.log(sheetToJson);
      await browser.close();
    } else if(newOrder === '0') {
      await browser.close();
    }

  } catch (error) {
    console.log(error);
  }
})();

