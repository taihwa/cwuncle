var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var pool = require('../config/mysql_info');
var app = express();
var customer;
const puppeteer = require('puppeteer');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('underscore');
const util = require('util');
const COUPANGHACM = require('../config/coupang_env');
const request = require('request');
const axios = require('axios');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser();
const Iconv = require('iconv').Iconv;
const euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
const nodemailer = require('nodemailer')
var unirest = require("unirest")

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
        return parted[1];
        } else {
        return null;
        }
    } else {
        return null;
    }
};

async function saveAllData (data) {
  return new Promise( (resolve, reject) => {
    pool.getConnection(function(err, conn) {
      conn.query('INSERT IGNORE INTO new_order (platform, jumunja, jumun_num, jumun_state, product_num, su, su_num1, su_num2, zipcode, address, product_name, cnt, message, delivery_pay, jumun_number, jungsan_price, sell_price, cw_code) VALUES ? ', [data], function(err, response, fields) {
        if (err) return reject(err);
        try {
          resolve(response)
        } catch (e) {
          reject(e);
        }
          conn.release();
      });
     });
  })
}


async function download(page, f) {
  const downloadPath = path.resolve(
    './download',
    `naver-${Math.random()
      .toString(36)
      .substr(2, 8)}`,
  );
  //const downloadPath = './download'
  await util.promisify(fs.mkdir)(downloadPath);
  console.error('Download directory:', downloadPath);

  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath,
  });
  try {
    await f();
  } catch (err) {
    console.log(err)
  }
  console.error('Downloading...');
  let fileName;
  console.error(fileName)
  console.error(downloadPath)
  while (!fileName || fileName.endsWith('.crdownload')) {
    await new Promise(resolve => setTimeout(resolve, 100));
    [fileName] = await util.promisify(fs.readdir)(downloadPath);
  }
  const filePath = path.resolve(downloadPath, fileName);
  console.error('Downloaded file:', filePath);
  return filePath;
}

async function eleven() {
  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10).replace(/-/g, '') + (`00${  currentDate.getHours()}`).slice(-2) + (`00${  currentDate.getMinutes()}`).slice(-2);
  const currentDate1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
  const preMonth = currentDate1.toISOString().slice(0, 10).replace(/-/g, '') + (`00${  currentDate.getHours()}`).slice(-2) + (`00${  currentDate.getMinutes()}`).slice(-2);
  const url = `https://api.11st.co.kr/rest/ordservices/complete/${preMonth}/${today}`;
  const data = {};
  const options = {
    encoding: 'binary', method: 'GET', uri: url, headers: { openapikey: '92fb17eed335c59a1f2df36c474eef7c' },
  };
  return new Promise((resolve, reject) => {
    request(options, (err, response, html) => {
      if (err) return reject(err);
      try {
        const contents = Buffer.from(html, 'binary'); // 인코딩 변환
        const result = euckr2utf8.convert(contents).toString();
        let resultToJson;
        xmlParser.parseString(result, (err, json) => {
          if (err) return;
          if (!json['ns2:orders']) return false;
          resultToJson = json['ns2:orders']['ns2:order'];
          resolve(resultToJson);
        });
      } catch (e) {
        reject(e);
      }

    });
  });
}

router.get('/new_order/naver', passport.authenticate('jwt-1', { session: false}), async function(req, res, next) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  try {
    await page.goto('https://sell.smartstore.naver.com/#/login', 'networkidle0');
    await page.waitFor(3000);
    req.io.sockets.emit('update', '네이버 접속성공')
    req.io.sockets.emit('update', '로그인 중...');
    await page.click('#loginId');
    await page.keyboard.type('dlxoghk1');
    await page.click('#loginPassword');
    await page.keyboard.type('hwa30102##');
    await page.click('#loginButton');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    req.io.sockets.emit('update', '로그인 성공');
    await page.mouse.click(1.0, 1.0);
    await page.waitFor(3000);
    req.io.sockets.emit('update', '모달 확인 중');
    const modalCloseBtn = await page.$('body > div.modal.fade.seller-layer-modal.modal-no-space.has-close-check-box.modal-transparent.in > div > div > div.modal-header.bg-default > button');
    if (modalCloseBtn) {
      req.io.sockets.emit('update', '모달1 확인 제거');
      await page.evaluate(modalCloseBtn => modalCloseBtn.click(), modalCloseBtn);
      await modalCloseBtn.dispose();
    }
    const modalCloseBtn1 = await page.$('body > div.modal.fade.seller-layer-modal.modal-no-space.in > div > div > div.modal-header > button')
    if (modalCloseBtn1) {
      req.io.sockets.emit('update', '모달2 확인 제거');
      await page.evaluate(modalCloseBtn1 => modalCloseBtn1.click(), modalCloseBtn1);
      await modalCloseBtn1.dispose();
    }
    const simsaInfo = (await page.$x('//h3[text() = "심사 안내"]'))[0];
    if(simsaInfo) {
      req.io.sockets.emit('update', '심사 안내 있음');
      await page.click('body > div.modal.fade.seller-layer-modal.has-close-check-box.data-target-complete-window.in > div > div > div.modal-header.bg-primary > button');
    }
    req.io.sockets.emit('update', '모달 팝업 제거 완료');
    await page.waitFor(3000);
    await page.click('#_gnb_nav > ul > li:nth-child(2) > a');
    req.io.sockets.emit('update', '스토어 이동 클릭 함');
    //console.log(`Current directory: ${process.cwd()}`);
    //await page.screenshot({path: `${process.cwd()}/download/error.png`});
    req.io.sockets.emit('update', '스토어 이동 클릭 함');
    await page.waitForSelector('body > div.modal.model.fade.seller-layer-modal.data-target-channel-list.in > div > div > div.modal-body > div > div > div > div > div.select-area > div > label > p > span > span.text-title');
    req.io.sockets.emit('update', '선택창 열림');
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
    req.io.sockets.emit('update', '창원아재들로 변경 완료');
    req.io.sockets.emit('update', '신규주문 확인중');
    const newOrderElement = await page.$('#seller-content > ui-view > div > div > div > div > ui-view:nth-child(1) > div:nth-child(1) > div > div > ul > li:nth-child(2) > span.number-area > a');
    const newOrder = await page.evaluate(newOrderElement => newOrderElement.textContent, newOrderElement);
    await newOrderElement.dispose();
    req.io.sockets.emit('update', '신규주문 : ' + newOrder);
    if (newOrder !== '0') {
      req.io.sockets.emit('update', '신규주문 페이지 접속중');
      await page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery', 'networkidle0');
      await page.waitFor(3000);
      req.io.sockets.emit('update', '신규주문 페이지 접속완료');
      const newOrderFrame = await page.frames()[1];
      await newOrderFrame.select('#rowPerPageType', 'ROW_CNT_500');
      await newOrderFrame.waitForSelector('#gridbox > div:nth-child(2) > div.objbox > table > tbody > tr:nth-child(2) > td:nth-child(4)');
      req.io.sockets.emit('update', '엑셀 다운로드 중');
      const path = await download(page, () => {
        newOrderFrame.click('#searchAddtionForm > button.npay_btn_common.size_medium.type_basic._excelDownloadBtn');
      });
      req.io.sockets.emit('update', '엑셀 다운로드 완료');
      req.io.sockets.emit('update', '엑셀 저장 중');
      const { size } = await util.promisify(fs.stat)(path);
      const buf = await fs.readFileSync(path);
      const wb = xlsx.read(buf, { type: 'buffer' });
      const sheet = wb.SheetNames[0];
      const sheetToJson = xlsx.utils.sheet_to_json(wb.Sheets[sheet], { range: 1 });
      const jumunInfos = [];
      const jumunInfoJsons = [];
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
        const jumunInfo = [
          '네이버',
          sheetToJson[i]['구매자명'],
          sheetToJson[i]['구매자연락처'],
          sheetToJson[i]['주문세부상태'],
          sheetToJson[i]['상품번호'],
          sheetToJson[i]['수취인명'],
          sheetToJson[i]['수취인연락처1'],
          sheetToJson[i]['수취인연락처2'],
          sheetToJson[i]['우편번호'],
          sheetToJson[i]['배송지'],
          product_name,
          sheetToJson[i]['수량'],
          sheetToJson[i]['배송메세지'],
          sheetToJson[i]['배송비 합계'],
          sheetToJson[i]['상품주문번호'],
          sheetToJson[i]['정산예정금액'],
          sheetToJson[i]['상품별 총 주문금액'],
          cw_code,
        ];
        const jumunInfoJson = {
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
        jumunInfoJsons.push(jumunInfoJson);
      }
      await saveAllData(jumunInfos);
      req.io.sockets.emit('update', '엑셀 저장완료');
      res.send(jumunInfoJsons)
      await browser.close();
    } else if (newOrder === '0') {
      res.send('신규주문 없음')
      await browser.close();
    }
  } catch (error) {
    console.log(error);
    await browser.close();
  }
});

router.get('/new_order/esm', passport.authenticate('jwt-1', { session: false}), async function(req, res, next) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.on('dialog', async (dialog) => {
    console.log(dialog.message());
    await dialog.accept();
  });
  try {
    await page.goto('https://www.esmplus.com/Member/SignIn/LogOn', 'networkidle0');
    req.io.sockets.emit('update', 'esm관리자 페이지 접속');
    await page.waitFor(3000);
    req.io.sockets.emit('update', '로그인 시도');
    await page.click('#Id');
    await page.keyboard.type('cwuncle');
    await page.click('#Password');
    await page.keyboard.type('hwa30102##');
    await page.click('#btnLogOn');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    req.io.sockets.emit('update', '로그인 완료');
    req.io.sockets.emit('update', '팝업 닫는중');
    const pages = await browser.pages();
    pages.forEach((page) => {
      if (page.url().includes('Popup')) {
        page.close();
      }
    });
    req.io.sockets.emit('update', '팝업 닫기 완료');
    req.io.sockets.emit('update', '신규 주문건 확인중');
    const mainFrame = await page.frames().find(f => f.name() === 'ifm_contents');
    const newOrderElement = await mainFrame.$('#Pay')
    const newOrder = await mainFrame.evaluate(newOrderElement => newOrderElement.textContent, newOrderElement)
    await newOrderElement.dispose()
    req.io.sockets.emit('update', '신규 주문 : ' + newOrder);
    if(newOrder !== '0') {
      req.io.sockets.emit('update', '신규 주문 취합 중');
      await page.click('#TDM002 > a');
      await page.waitFor(3000);
      await page.click('#TDM105 > a');
      await page.waitFor(3000);
      await page.waitForSelector('#iTDM105');
      const frame = await page.frames().find(f => f.name() === 'ifm_TDM105');
      await frame.waitForSelector('#gridPanel');
      req.io.sockets.emit('update', '엑셀 다운 버튼 클릭');
      await frame.click('#excelDown');
      const confirmPopup = await browser.waitForTarget(target => target.url() === 'https://www.esmplus.com/Escrow/Popup/ExecelSplitDownLoad');
      await page.waitFor(3000);
      const popupPages = await browser.pages();
      const popup = popupPages[popupPages.length - 1];
      req.io.sockets.emit('update', '엑셀 다운로드 중');
      await page.screenshot({path: `${process.cwd()}/download/error.png`})
      console.log(await popup.$('#popContents > div > a:nth-child(1)'))
      const path = await download(page, () => {
        popup.click('#popContents > div > a:nth-child(1)');
      });
      req.io.sockets.emit('update', '엑셀 다운로드 완료');
      req.io.sockets.emit('update', '엑셀 저장 중');
      const buf = await fs.readFileSync(path);
      const wb = xlsx.read(buf, { type: 'buffer' });
      const sheet = wb.SheetNames[0];
      const sheetToJson = xlsx.utils.sheet_to_json(wb.Sheets[sheet]);
      const jumunInfos = [];
      const jumunInfoJsons = [];
      for (i = 0; i < sheetToJson.length; i++) {
        const jumunInfo = [
          sheetToJson[i]['아이디*'],
          sheetToJson[i]['구매자명'],
          sheetToJson[i]['구매자 휴대폰'],
          '신규주문',
          sheetToJson[i]['상품번호'],
          sheetToJson[i]['수령인명'],
          sheetToJson[i]['수령인 휴대폰'],
          sheetToJson[i]['수령인 전화번호'],
          sheetToJson[i]['우편번호'],
          sheetToJson[i]['주소'],
          sheetToJson[i]['상품명'],
          sheetToJson[i]['수량'],
          sheetToJson[i]['배송시 요구사항'],
          sheetToJson[i]['배송비 금액'],
          sheetToJson[i]['주문번호*'],
          sheetToJson[i]['정산예정금액'],
          sheetToJson[i]['판매금액'],
          sheetToJson[i]['판매자관리코드']
        ];
        const jumunInfoJson = {
          platform: sheetToJson[i]['아이디*'],
          jumunja: sheetToJson[i]['구매자명'],
          jumun_num: sheetToJson[i]['구매자 휴대폰'],
          jumun_state: '신규주문',
          product_num: sheetToJson[i]['상품번호'],
          su: sheetToJson[i]['수령인명'],
          su_num1: sheetToJson[i]['수령인 휴대폰'],
          su_num2: sheetToJson[i]['수령인 전화번호'],
          zipcode: sheetToJson[i]['우편번호'],
          address: sheetToJson[i]['주소'],
          product_name : sheetToJson[i]['상품명'],
          cnt: sheetToJson[i]['수량'],
          message: sheetToJson[i]['배송시 요구사항'],
          delivery_pay: sheetToJson[i]['배송비 금액'],
          jumun_number: sheetToJson[i]['주문번호*'],
          jungsan_price: sheetToJson[i]['정산예정금액'],
          sell_price: sheetToJson[i]['판매금액'],
          cw_code: sheetToJson[i]['판매자관리코드'],
        };
        jumunInfos.push(jumunInfo);
        jumunInfoJsons.push(jumunInfoJson);
      }
      console.log(jumunInfos)
      await saveAllData(jumunInfos);
      req.io.sockets.emit('update', '엑셀 저장완료');
      res.send(jumunInfoJsons)
      await browser.close();
    } else if (newOrder === '0') {
      res.send('신규주문 없음')
      await browser.close();
    }
  } catch (error) {
    console.log(error);
    await browser.close();
  }
});

async function coupang() {
  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10);
  const currentDate1 = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate() + 3);
  const preMonth = currentDate1.toISOString().slice(0, 10);
  const url = `https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/A00147212/ordersheets?createdAtFrom=${preMonth}&createdAtTo=${today}&maxPerPage=50&status=ACCEPT`;
  const data = {};
  const hacm = COUPANGHACM.getHACM('GET', url, data);

  return axios.get(url, {
    headers:
    {
      Authorization: hacm,
      'X-Requested-By': 'A00147212',
    },
  }).then(data => data.data.data).catch((err) => {
    if (err) {
      return 0;
    }
  });
}



router.get('/new_order/coupang', passport.authenticate('jwt-1', { session: false}), async function(req, res, next) {
  const coupangData = await coupang();
  console.log(coupangData)
  let jumunInfos = [];
  let jumunInfoJsons = [];
  if (coupangData.length !== 0) {
    console.log('쿠팡 성공');
    let jumunInfoJson = {};
    let jumunInfo = [];
    coupangData.forEach((data) => {
      data.orderItems.forEach((item) => {
        jumunInfoJson['platform'] = '쿠팡';
        jumunInfoJson['jumunja'] = data.orderer.name;
        jumunInfoJson['jumun_num'] = data.orderer.safeNumber;
        jumunInfoJson['jumun_state'] = '신규주문';
        jumunInfoJson['su'] = data.receiver.name;
        jumunInfoJson['su_num1'] = data.receiver.safeNumber;
        jumunInfoJson['su_num2'] = data.receiver.receiverNumber;
        jumunInfoJson['zipcode'] = data.receiver.postCode;
        jumunInfoJson['address'] = data.receiver.addr1 + ' ' + data.receiver.addr1;
        jumunInfoJson['message'] = data.parcelPrintMessage;
        jumunInfoJson['jumun_number'] = data.orderId;
        jumunInfoJson['product_num'] = item.vendorItemId;
        jumunInfoJson['product_name'] = item.vendorItemPackageName;
        jumunInfoJson['cnt'] = item.shippingCount;
        jumunInfoJson['delivery_pay'] = data.shippingPrice;
        jumunInfoJson['jungsan_price'] = item.orderPrice * 0.9;
        jumunInfoJson['sell_price'] = item.orderPrice;
        jumunInfoJson['cw_code'] = item.externalVendorSkuCode;

        jumunInfo.push('쿠팡');
        jumunInfo.push(data.orderer.name);
        jumunInfo.push(data.orderer.safeNumber);
        jumunInfo.push('신규주문');
        jumunInfo.push(item.vendorItemId);
        jumunInfo.push(data.receiver.name);
        jumunInfo.push(data.receiver.safeNumber);
        jumunInfo.push(data.receiver.ordererNumber);
        jumunInfo.push(data.receiver.postCode);
        jumunInfo.push(data.receiver.addr1 + ' ' + data.receiver.addr2);
        jumunInfo.push(item.vendorItemName);
        jumunInfo.push(item.shippingCount);
        jumunInfo.push(data.parcelPrintMessage);
        jumunInfo.push(data.shippingPrice);
        jumunInfo.push(data.orderId);
        jumunInfo.push(item.orderPrice * 0.9);
        jumunInfo.push(item.orderPrice);
        jumunInfo.push(item.externalVendorSkuCode);
      });
      jumunInfoJsons.push(jumunInfoJson);
      jumunInfos.push(jumunInfo);
    });
    await saveAllData(jumunInfos);
    res.send(jumunInfoJsons)
    console.error('jumunInfos - - - - - - - -');
    console.log(jumunInfos);
    console.error('jumunInfoJson - - - - - - - -');
    console.log(jumunInfoJson);
  } else {
    res.send('신규주문 없음')
  }
});

router.get('/new_order/11st', passport.authenticate('jwt-1', { session: false}), async function(req, res, next) {

  const elevenData = await eleven();

  if (elevenData) {
    console.log('11번가 성공')
    let jumunInfos = [];
    let jumunInfoJsons = [];
    let jumunInfoJson = {};
    let jumunInfo = [];
    res.send(elevenData);
    elevenData.forEach( (data) => {
      jumunInfoJson['platform'] = '11번가';
      jumunInfoJson['jumunja'] = data.ordNm[0];
      jumunInfoJson['jumun_num'] = data.ordPrtblTel[0];
      jumunInfoJson['jumun_state'] = '신규주문';
      jumunInfoJson['su'] = data.rcvrNm[0];
      jumunInfoJson['su_num1'] = data.rcvrPrtblNo[0];
      jumunInfoJson['su_num2'] = data.rcvrTlphn[0];
      jumunInfoJson['zipcode'] = data.rcvrMailNo[0];
      jumunInfoJson['address'] = data.rcvrBaseAddr[0] + ' ' + data.rcvrDtlsAddr[0];
      jumunInfoJson['message'] = data.ordDlvReqCont[0];
      jumunInfoJson['jumun_number'] = data.ordNo[0];
      jumunInfoJson['product_num'] = data.prdNo[0];
      jumunInfoJson['product_name'] = data.prdNm[0];
      jumunInfoJson['cnt'] = data.ordQty[0];
      jumunInfoJson['delivery_pay'] = data.lstDlvCst[0];
      jumunInfoJson['jungsan_price'] = data.ordAmt[0] * 0.88;
      jumunInfoJson['sell_price'] = data.ordAmt[0];
      jumunInfoJson['cw_code'] = data.sellerPrdCd[0];

      jumunInfo.push('11번가'); //
      jumunInfo.push(data.ordNm[0]); //주문자
      jumunInfo.push(data.ordPrtblTel[0]); //주문자번호
      jumunInfo.push('신규주문'); //주문상태
      jumunInfo.push(data.rcvrNm[0]); // 수취인
      jumunInfo.push(data.rcvrPrtblNo[0]); // 수취인연락처1
      jumunInfo.push(data.rcvrTlphn[0]); // 수취인연락처2
      jumunInfo.push(data.rcvrMailNo[0]); // 우편번호
      jumunInfo.push(data.rcvrBaseAddr[0] + ' ' + data.rcvrDtlsAddr[0]); //주소
      jumunInfo.push(data.ordDlvReqCont[0]); // 배송메세지
      jumunInfo.push(data.ordNo[0]); // 주문번호
      jumunInfo.push(data.prdNo[0]); // 상품번호
      jumunInfo.push(data.prdNm[0]); // 상품명
      jumunInfo.push(data.ordQty[0]); // 수량
      jumunInfo.push(data.lstDlvCst[0]); // 배송비
      jumunInfo.push(data.ordAmt[0] * 0.88); // 정산받는 돈
      jumunInfo.push(data.ordAmt[0]); // 판매가
      jumunInfo.push(data.sellerPrdCd[0]); // 상품코드

      jumunInfoJsons.push(jumunInfoJson);
      jumunInfos.push(jumunInfo);
    });
    await saveAllData(jumunInfos);
    res.send(jumunInfoJsons)
    console.error('jumunInfos - - - - - - - -');
    console.log(jumunInfos);
    console.error('jumunInfoJson - - - - - - - -');
    console.log(jumunInfoJson);
  } else {
    res.send('신규주문 없음')
  }
});

async function sendMail(email, json) {
  let workbook = xlsx.utils.book_new()
  let worksheet = xlsx.utils.json_to_sheet(json)
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  let opts = {bookType:'xlsx', bookSST:false, type:'buffer'}
  let wbout = xlsx.write(workbook, opts)
  var now = new Date()
  var date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  date = date.toISOString().slice(0, 10).replace(/-/g, '-')
  try {
    const mailConfig = {
      service: 'naver',
      host: 'smtp.naver.com',
      port: 465,
      auth: {
        user: 'cwuncle',
        pass: 'hwa30102@@'
      }
    }
    const message = {
      from: 'cwuncle@naver.com',
      to: email,
      subject: `${date} 창원아재들 주문건입니다`,
      html: '<p>감사합니다. 발송하시면 송장 회신 부탁드립니다.</p>',
      attachments: [
        {
          filename: `창원아재들 ${date}.xlsx`,
          content: new Buffer(wbout,'utf-8')
        }
      ]
    }
    const transporter = nodemailer.createTransport(mailConfig)
    const result = await transporter.sendMail(message)
    return result
  } catch (e) {
    console.log(e)
  }
}


// 새주문
router.get('/neworder', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  console.log('새주문');
  var token = getToken(req.headers);
  if (token) {
      pool.getConnection(function(err, conn) {
          conn.query('SELECT * FROM new_order', function(err, response, fields) {
              res.send(response);
              conn.release();
          });
      });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

// 전체 조회
router.get('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        pool.getConnection(function(err, conn) {
            conn.query('SELECT * FROM customer', function(err, response, fields) {
                res.send(response);
                conn.release();
            });
        });
        res.send("ok");
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
});

//월별조회
router.get('/month/:month', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var sql = 'SELECT * FROM customer WHERE date LIKE ' + pool.escape(req.params.month+'%');
  pool.getConnection(function(err, conn) {
      conn.query(sql, function(err, response, fields) {
          res.send(response);
          conn.release();
      });
  });
});

//기간조회
router.get('/:date1/:date2', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var sql = 'SELECT * FROM customer WHERE DATE(date) BETWEEN ' + pool.escape(req.params.date1) + ' AND ' + pool.escape(req.params.date2);
        pool.getConnection(function(err, conn) {
            conn.query(sql, function(err, response, fields) {
                res.send(response);
                conn.release();
            });
        });
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
});
router.post('/search', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    var sql = `SELECT * FROM customer WHERE (DATE(date) BETWEEN ${pool.escape(req.body.date1)} AND ${pool.escape(req.body.date2)}) AND (${req.body.searchSelected} = ${pool.escape(req.body.text)})`;
    // var sql = `SELECT * FROM customer WHERE DATE(date) BETWEEN ${pool.escape(req.body.date1)} AND ${pool.escape(req.body.date2)}`;
    // var sql = `SELECT * FROM customer WHERE ${req.body.searchSelected} = ${pool.escape(req.body.text)}`;
    pool.getConnection(function(err, conn) {
        conn.query(sql, function(err, response, fields) {
            res.send(response);
            conn.release();
        });
    })
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});
router.post('/search1', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body)
    var sql = `SELECT * FROM customer WHERE (DATE(date) BETWEEN ${pool.escape(req.body.date1)} AND ${pool.escape(req.body.date2)}) AND (product_code = ${pool.escape(req.body.searchSelected)})`;
    // var sql = `SELECT * FROM customer WHERE DATE(date) BETWEEN ${pool.escape(req.body.date1)} AND ${pool.escape(req.body.date2)}`;
    // var sql = `SELECT * FROM customer WHERE ${req.body.searchSelected} = ${pool.escape(req.body.text)}`;
    pool.getConnection(function(err, conn) {
        conn.query(sql, function(err, response, fields) {
            res.send(response);
            conn.release();
        });
    })
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});
// 날짜별 조회
router.get('/:date', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var date = req.params.date;
        pool.getConnection(function(err, conn) {
            console.log(date);
            conn.query('SELECT * FROM customer WHERE ?', {date : date} , function(err, response, fields) {
                res.send(response);
                conn.release();
            });
        });
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
});
//2019-03-11 async await로 업데이트

router.post('/', passport.authenticate('jwt-1', { session: false}), (req, res, next) => {

  var token = getToken(req.headers);
    if (token) {
        customer = req.body;
        processArray(customer)

    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }

    function delay(data) {
      pool.getConnection(function(err, conn) {
        conn.query('INSERT INTO customer SET ?', data , function(err, res, fields) {
            if(err) throw err;
            conn.release();
            if(res) {
              return res
              }
          })
      });
    }

    async function delayedLog(item) {
      await delay(item);
    }

    async function processArray(customer) {
      for (const item of customer) {
        await delayedLog(item);
      }

      res.json({success:true})
    }
});

router.post('/jung_san', passport.authenticate('jwt-1', { session: false}), (req, res, next) => {
  var token = getToken(req.headers);
    if (token) {
      pool.getConnection(function(err, conn) {
        conn.query('INSERT INTO jung_san (platform, date, order_num, product_code, shop_name, product_name, cnt, gong_price, fjungsan_price, tjungsan_price) VALUES ? ', [req.body], function(err, response, fields) {
          if (err) return reject(err);
          conn.release();
          res.send({success:true});
        });
       });
    } else {
      res.status(403).send({success: false, msg: '인증안됨'});
    }
});

router.put('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  console.log(req.body)
  var token = getToken(req.headers);
  if (token) {
    var data = req.body;
    var len = data.length;
    if(len === undefined) {
      var data1 = [];
      data1[0] = data;
      processArray(data1)
    } else {
      processArray(data)
    }
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }

  function delay(data) {
    var data1 = data;
    var keys = []
    var obj = []
    var sql = 'UPDATE customer SET ';
    for(key in data1) {
        if(key !== "num" && key !== "edit") {
            keys.push(key)
            obj.push(data1[key])
        }
    }
    for(let i = 0; i < keys.length; i++) {
        if(i+1 === keys.length) {
            sql += keys[i] + ' = ? WHERE num = ?';
        }else{
            sql += keys[i] + ' = ?, ';
        }
    }
    obj.push(data1.num)
    console.log(sql)
    pool.getConnection(function(err, conn) {
        conn.query(sql, obj, function(err, response, fields) {
            if(err) throw err;
                conn.release();
                if(response) {
                  return response
                }
                console.log(response)
        });
    });
  }

  async function delayedLog(item) {
    await delay(item);
  }

  async function processArray(customer) {
    for (const item of customer) {
      await delayedLog(item);
    }

    res.json({success:true})
    }
});


router.post('/delete', passport.authenticate('jwt-1', { session: false}) , function(req, res) {
  console.log('delete')
  var token = getToken(req.headers);
  if (token) {
    pool.getConnection(function(err, conn) {
      conn.query('DELETE FROM customer WHERE num = ?', req.body.num, function(err, response, fields) {
        if(err) throw err;
          if(response) {
              res.json({success:true})
          }
          conn.release();
      });
    });
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
})

router.post('/call', passport.authenticate('jwt-1', { session: false}), function(req,res) {
  console.log('call')
  var token = getToken(req.headers);
  if (token) {
    var data = req.body;
    pool.getConnection(function(err,conn) {
      conn.query('INSERT INTO customer SET ?', data, function(err, response) {
        if(err) throw err;
        if(response) {
          console.log(response);
          res.send('ok');
        }
        conn.release();
      })
    })
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
})

function sendSms (phoneNum, text) {
  return new Promise(resolve => {
    var req = unirest("POST", "http://api.apistore.co.kr/ppurio/1/message/sms/blackbagsoft")
    req.headers({
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "x-waple-authorization": "NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ=="
    })
    req.form({
      "dest_phone": phoneNum,
      "send_phone": "01030640144",
      "msg_body": text
    })
    req.end(function (res) {
      resolve(res)
    })
  })
}
router.post('/sendSms', passport.authenticate('jwt-1', { session: false}), async function(req,res) {
  var token = getToken(req.headers);
  if (token) {
    let data = req.body
    const result = await sendSms(data.phone, data.text)
    const smsResponse = JSON.parse(result.raw_body)
    if (smsResponse.result_message === 'OK') {
      res.status(200).send({success: true, msg: `${data.phone}로 문자 보냈슴다`})
    }
    } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
    }
})
router.post('/send', passport.authenticate('jwt-1', { session: false}), async function(req,res) {
  var token = getToken(req.headers);
  if (token) {
    let data = req.body
    if (data.type === 'companyEmail' || data.type ==='deliveryEmail') {
      const result = await sendMail(data.info, data.json)
      if (result) {
        res.status(200).send({success: true, msg: `${data.info}로 메일 보냈슴다`})
      }
    }
    if (data.type === 'sms') {
      const text = '창원아재들입니다. 오늘 주문건 확인 부탁드립니다. https://cwpartner-b3a7a.web.app'
      const result = await sendSms(data.info, text)
      const smsResponse = JSON.parse(result.raw_body)
      console.log(smsResponse)
      if (smsResponse.result_message === 'OK') {
        res.status(200).send({success: true, msg: `${data.info}로 문자 보냈슴다`})
      }
    }
    } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
    }
})

/**2018-09-13 업데이트 */
router.put('/songjang', function(req, res, next) {
  var data = req.body;
  var len = data.length;
  update_callback1(len, 0, data);
});

function update_callback1(len, num, data) {
  if(num === len) return 'ok';
  if(num < len) {
      var data1 = data[num];
      var key = data1.num;
      var delivery_company = data1.delivery_company;
      var delivery_num = data1.delivery_num;
      pool.getConnection(function(err, conn) {
          conn.query('UPDATE customer SET delivery_company = ?, delivery_num = ? WHERE num = ?', [delivery_company, delivery_num, key], function(err, response, fields) {
              if(err) throw err;
                  if(response) {
                      update_callback1(len, num+1, data);
                  }
                  conn.release();
                  console.log(response)
          });
      });

  }
}

module.exports = router;
