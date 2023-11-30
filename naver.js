const puppeteer = require('puppeteer');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('underscore');
const util = require('util');

async function download(page, f) {
  const downloadPath = path.resolve(
    process.cwd(),
    `naver-${Math.random()
      .toString(36)
      .substr(2, 8)}`,
  );
  await util.promisify(fs.mkdir)(downloadPath);
  console.error('Download directory:', downloadPath);

  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath,
  });

  await f();

  console.error('Downloading...');
  let fileName;
  while (!fileName || fileName.endsWith('.crdownload')) {
    await new Promise(resolve => setTimeout(resolve, 100));
    [fileName] = await util.promisify(fs.readdir)(downloadPath);
  }

  const filePath = path.resolve(downloadPath, fileName);
  console.error('Downloaded file:', filePath);
  return filePath;
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1980, height: 1280 },
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://sell.smartstore.naver.com/#/login', 'networkidle0');
    await page.waitFor(3000);
    await page.click('#loginId');
    await page.keyboard.type('dlxoghk1');
    await page.click('#loginPassword');
    await page.keyboard.type('hwa30102##');
    await page.click('#loginButton');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    await page.mouse.click(1.0, 1.0);
    await page.waitFor(3000);
    const modalCloseBtn = await page.$('body > div.modal.fade.seller-layer-modal.modal-no-space.has-close-check-box.modal-transparent.in > div > div > div.modal-header.bg-default > button');
    if (modalCloseBtn) {
      await page.evaluate(modalCloseBtn => modalCloseBtn.click(), modalCloseBtn);
      await modalCloseBtn.dispose();
    }
    await page.waitFor(3000);
    await page.click('#_gnb_nav > ul > li:nth-child(2) > a');
    await page.waitFor(3000);
    const CurrentStoreElement = await page.$('body > div.modal.model.fade.seller-layer-modal.data-target-channel-list.in > div > div > div.modal-body > div > div > div > div > div.select-area > div > label > p > span > span.text-title');
    const storeName = await page.evaluate(CurrentStoreElement => CurrentStoreElement.textContent, CurrentStoreElement);
    await CurrentStoreElement.dispose();
    if (storeName === '스마트스토어오늘의 장터') {
      await page.click('body > div.modal.model.fade.seller-layer-modal.data-target-channel-list.in > div > div > div.modal-body > div > div > ul > li > div > div.select-area > div > label > input[type=radio]');
      await page.waitForNavigation('networkidle0');
    } else {
      await page.mouse.click(1, 1);
      await page.waitFor(3000);
    }
    const newOrderElement = await page.$('#seller-content > ui-view > div > div > div > div > ui-view:nth-child(1) > div:nth-child(1) > div > div > ul > li:nth-child(2) > span.number-area > a');
    const newOrder = await page.evaluate(newOrderElement => newOrderElement.textContent, newOrderElement);
    await newOrderElement.dispose();
    if (newOrder !== '0') {
      await page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery', 'networkidle0');
      await page.waitFor(3000);
      const newOrderFrame = await page.frames()[1];
      await newOrderFrame.select('#rowPerPageType', 'ROW_CNT_500');
      await newOrderFrame.waitForSelector('#gridbox > div:nth-child(2) > div.objbox > table > tbody > tr:nth-child(2) > td:nth-child(4)');

      const path = await download(page, () => {
        newOrderFrame.click('#searchAddtionForm > button.npay_btn_common.size_medium.type_basic._excelDownloadBtn._click\\28 nmp\\2e seller_admin\\2e order\\2e n\\2e sale\\2e delivery\\2e excelDownload\\28 \\29 \\29._stopDefault');
      });
      const { size } = await util.promisify(fs.stat)(path);
      const buf = await fs.readFileSync(path);
      const wb = xlsx.read(buf, { type: 'buffer' });
      const sheet = wb.SheetNames[0];
      const sheetToJson = xlsx.utils.sheet_to_json(wb.Sheets[sheet], { range: 1 });
      console.log(sheetToJson);
      const jumunInfos = [];
      for (i = 0; i < sheetToJson.length; i++) {
        let cw_code = '';
        let product_name = '';
        if (sheetToJson[i]['상품종류'] === '단일상품') {
          cw_code = sheetToJson[i]['판매자 상품코드'];
          product_name = sheetToJson[i]['상품명'];
        } else if (sheetToJson[i]['상품종류'] === '조합형옵션상품') {
          cw_code = sheetToJson[i]['옵션관리코드'];
          product_name = sheetToJson[i]['옵션정보'];
        }
        if (!sheetToJson[i]['정산예정금액']) {
          sheetToJson[i]['정산예정금액'] = sheetToJson[i]['상품별 총 주문금액'] * 0.943
        }
        const jumunInfo = {
          platform: '네이버',
          jumunja: sheetToJson[i]['구매자명'],
          jumun_num: sheetToJson[i]['구매자연락처'],
          jumun_state: sheetToJson[i]['주문세부상태'],
          product_num: sheetToJson[i]['상품번호'],
          su: sheetToJson[i]['수취인명'],
          su_num1: sheetToJson[i]['수취인연락처1'],
          su_num2: sheetToJson[i]['수취인연락처2'],
          zipcode: sheetToJson[i]['우편번호'],
          address: sheetToJson[i]['배송지'],
          product_name,
          cnt: sheetToJson[i]['수량'],
          message: sheetToJson[i]['배송메세지'],
          delivery_pay: sheetToJson[i]['배송비 합계'],
          jumun_number: sheetToJson[i]['상품주문번호'],
          jungsan_price: sheetToJson[i]['정산예정금액'],
          sell_price: sheetToJson[i]['상품별 총 주문금액'],
          cw_code,
        };
        jumunInfos.push(jumunInfo);
      }
      console.log(jumunInfos);
      await browser.close();
    } else if (newOrder === '0') {
      await browser.close();
    }
  } catch (error) {
    console.log(error);
  }
})();
