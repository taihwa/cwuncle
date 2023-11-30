const puppeteer = require('puppeteer');
const request = require('request');
const _ = require('underscore');
const axios = require('axios');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser();
const Iconv = require('iconv').Iconv;
const COUPANGHACM = require('../config/coupang_env');
const euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');
var passport = require('passport');
require('../config/passport')(passport);
var pool = require('../config/mysql_info');
var cron = require('node-cron');

cron.schedule('*/20 * * * *', () => {
  console.log('cron 실행')
  main();
})
//const CronJob = require('cron').CronJob;
const randomUseragent = require('random-useragent');

//const job = new CronJob('0 */10 * * * *', function() {
//  const d = new Date();
//  console.log('Every Tenth Minute:', d);
//  main();
//}, null, true, 'Asia/Seoul');
//savePredictData();
//job.start();
//main();


function delay(data) {
  if(data['product_name']) {
    console.log(data)
    pool.getConnection(function(err, conn) {
      conn.query('INSERT INTO predict SET ?', data , function(err, res, fields) {
        console.log(res)
          if(err) throw err;
          conn.release();
          if(res) return res;
        })
    });
  }

}

async function delayedLog(item) {
  await delay(item);
}

async function processArray(customer) {
  for (const item of customer) {
    await delayedLog(item);
  }
}

async function saveAllData (data) {
  return new Promise( (resolve, reject) => {
    pool.getConnection(function(err, conn) {
      conn.query('INSERT INTO predict (product_name, product_code, product_cnt, gong_price, platform) VALUES ? ', [data], function(err, response, fields) {
        if (err) return reject(err);
        try {
          console.log(response)
          resolve(response)
        } catch (e) {
          reject(e);
        }
          conn.release();
      });
     });
  })
}

async function getProductData () {
  return new Promise( (resolve, reject) => {
    pool.getConnection(function(err, conn) {
      conn.query('SELECT * FROM product', function(err, response, fields) {
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

async function deletePredictData () {
  return new Promise( (resolve, reject) => {
    pool.getConnection(function(err, conn) {
      conn.query('TRUNCATE TABLE predict', function(err, response, fields) {
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

async function main() {
  const predicData = [];
  const coupangData = await coupang();
  if (coupangData.length !== 0) {
    console.log('쿠팡 성공');
    coupangData.forEach((data) => {
      data.orderItems.forEach((item) => {
        const cData = {};
        cData.platform = 'coupang';
        cData.productCode = item.externalVendorSkuCode;
        cData.cnt = item.shippingCount;
        predicData.push(cData);
      });
    });
  }

  const elevenData = await eleven();
  if (elevenData) {
    console.log('11번가 성공')
    elevenData.forEach( (data) => {
      const eData = {};
      eData.platform = '11st';
      eData.productCode = data.sellerPrdCd[0];
      eData.cnt = data.ordQty[0];
      predicData.push(eData);
    });
  }


  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  console.log(randomUseragent.getRandom())
  await page.setUserAgent(randomUseragent.getRandom())
  try {
    console.log('네이버 실행');
    await page.goto('https://sell.smartstore.naver.com/#/login', 'networkidle0');
    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body.innerHTML, bodyHandle);
    await bodyHandle.dispose();
    console.log(html)
    await page.click('#loginId');
    await page.keyboard.type('dlxoghk1');
    await page.click('#loginPassword');
    await page.keyboard.type('hwa30102##');
    await page.click('#loginButton');
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    await page.mouse.click(1.0, 1.0);
    await page.waitFor(3000);
    await page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery', 'networkidle0');
    await page.waitFor(3000);
    await page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery', 'networkidle0');
    await page.waitFor(3000);
    const bodyHandle1 = await page.$('body');
    const html1 = await page.evaluate(body => body.innerHTML, bodyHandle1);
    await bodyHandle.dispose();
    const newOrderFrame = await page.frames()[1];

    await newOrderFrame.waitForSelector('#rowPerPageType');
    await newOrderFrame.select('#rowPerPageType', 'ROW_CNT_500');
    //await newOrderFrame.waitForSelector('#gridbox > div:nth-child(2) > div.objbox > table > tbody > tr:nth-child(2) > td:nth-child(4)');
    const leftTitleSelector = '#gridbox > div:nth-child(1) > div.xhdr > table > tbody > tr:nth-child(2) > td';
    const naverNewOrder = await newOrderFrame.$('#gridbox > div:nth-child(2) > div.objbox > table > tbody > tr:nth-child(2) > td:nth-child(4)');
    if(naverNewOrder) {
      await newOrderFrame.waitForSelector(leftTitleSelector);
      const titles = await newOrderFrame.evaluate(() => [...document.querySelectorAll('#gridbox > div:nth-child(1) > div.xhdr > table > tbody > tr:nth-child(2) div.hdrcell')].map(elem => elem.innerHTML));
      titles.splice(0, 1);
      const productNames = await newOrderFrame.evaluate(() => [...document.querySelectorAll('#gridbox > div:nth-child(2) > div.xhdr > table > tbody > tr:nth-child(2) div.hdrcell')].map(elem => elem.textContent));
      const contents = await newOrderFrame.evaluate(() => [...document.querySelectorAll('#gridbox > div:nth-child(2) > div.objbox > table > tbody > tr')].map(elem => [...elem.childNodes].map(elem => elem.textContent)));
      const naverData = [];
      for (let i = 0; i < contents.length; i++) {
        const obj = {};
        for (let k = 0; k < productNames.length; k++) {
          obj[productNames[k]] = contents[i][k];
        }
        naverData.push(obj);
      }
      naverData.splice(0, 1);
      if (naverData) {
        console.log('네이버성공');
        naverData.forEach((data) => {
          const nData = {};
          const cnt = data['수량'];
          const productCode = data['판매자 상품코드'];
          const optionCode = data['옵션관리코드'];
          if (optionCode === ' ') {
            nData.platform = 'naver';
            nData.productCode = productCode;
            nData.cnt = cnt;
          } else {
            nData.platform = 'naver';
            nData.productCode = optionCode;
            nData.cnt = cnt;
          }
          predicData.push(nData);
        });
      }
    }


    console.log('이베이 실행');
    page.on('dialog', async (dialog) => {
      console.log('dialog');
      await dialog.accept();
    });
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
    await page.waitFor(5000);
    await page.click('#TDM002 > a');
    await page.waitFor(3000);
    await page.click('#TDM105 > a');
    await page.waitFor(3000);
    await page.waitForSelector('#iTDM105');
    const frame = await page.frames().find(f => f.name() === 'ifm_TDM105');
    await frame.waitForSelector('#gridPanel');
    const etitles = await frame.evaluate(() => [...document.querySelectorAll('#gridPanel > div > div.grid_table_type1.sb-grid-hct > table > thead > tr > th > span')].map(elem => elem.textContent));
    const econtents = await frame.evaluate(() => [...document.querySelectorAll('#dataGrid > table > tbody > tr')].map(elem => [...elem.childNodes].map(elem => elem.textContent)));
    const ebayData = [];
    for (let i = 0; i < econtents.length; i++) {
      const obj = {};
      for (let k = 0; k < etitles.length; k++) {
        obj[etitles[k]] = econtents[i][k + 1];
      }
      ebayData.push(obj);
    }
    if (ebayData) {
      console.log('이베이성공');
      ebayData.forEach((data) => {
        const eData = {};
        const cnt = data['수량'];
        const productCode = data['판매자 관리코드'];
        eData.platform = 'ebay';
        eData.productCode = productCode;
        eData.cnt = cnt;
        predicData.push(eData);
      });
    }
    console.log('카카오 실행')
    await page.goto('https://store-sell.kakao.com/', 'networkidle0');
    console.log('카카오 페이지 이동')
    await page.waitFor(3000);
    await page.click('#mArticle > div > div.start_btn > a.btn_start.btn_login')
    console.log('카카오 로그인 페이지로 이동 클릭')
    await page.waitFor(5000);
    //await page.waitForNavigation('networkidle0');
    const bodyHandle12 = await page.$('body');
    const html12 = await page.evaluate(body => body.innerHTML, bodyHandle12);
    await bodyHandle12.dispose();
    console.log(html12)
    await page.click('#loginEmail');
    await page.keyboard.type('cwuncle@naver.com');
    await page.click('#loginPw');
    await page.keyboard.type('hwa30102@@');
    await page.click('#login-form > fieldset > button');
    console.log('카카오 로그인 완료')
    await page.waitForNavigation('networkidle0');
    await page.waitFor(3000);
    //await page.click('#mArticle > div.inner_comm > div.shop_list > div.item_shop.item_on > button');
    //await page.waitForNavigation('networkidle0');
    //await page.waitFor(3000);
    const kakaoPopup = await page.$('body > cu-container > div > div > div > div > div > cu-dialog > div > div.popup_foot');
    console.log('kakaoPopup', kakaoPopup)
    if(kakaoPopup) {
      await page.click('body > cu-container > div > div > div > div > div > cu-dialog > div > div.popup_foot > a');
    }
    await page.waitFor(3000)
    const newOrderSelector = await page.$('#mArticle > div > div:nth-child(2) > wf-view-dashboard-shipping > div > div > ul > li:nth-child(1) > a > span')
    const newOrder = await page.evaluate(body => body.textContent, newOrderSelector);
    await newOrderSelector.dispose();
    if(newOrder !== '0') {
      await page.click('#mArticle > div > div:nth-child(2) > wf-view-dashboard-shipping > div > div > ul > li:nth-child(1) > a');
      await page.waitForSelector('#exportExcel_channelItem');
      const ktitles = await page.evaluate(() => [...document.querySelectorAll('#page-grid-box_AX_gridColHead > table > tbody > tr > td > div.tdRelBlock > div.colHeadTdText')].map(elem => elem.textContent));
      const kcontents = await page.evaluate(() => [...document.querySelectorAll('#page-grid-box_AX_tbody > tr')].map(elem => [...elem.childNodes].map(elem => [...elem.childNodes].map(elem => elem.textContent))));
      await browser.close();
      const kakaoData = [];

      for (let i = 0; i < kcontents.length; i++) {
        const obj = {};
        for (let k = 0; k < ktitles.length; k++) {
            obj[ktitles[k]] = kcontents[i][k + 1][0];
        }
        kakaoData.push(obj);
      }
      console.log(kakaoData);
        if (!kakaoData) console.log('실패');
        if (kakaoData) {
          kakaoData.forEach((data) => {
          const kData = {};
          const platform = 'kakao';
          const cnt = data['수량'];
          const productCode = data['판매자상품번호'];
          const optionCode = data['옵션코드'];
          kData.platform = platform;

          if (optionCode) {
            kData.productCode = optionCode;
          } else {
            kData.productCode = productCode;
          }
          kData.cnt = cnt;
          predicData.push(kData);
          });
          console.log('카카오 성공');
        } else {
          console.log('데이터 없음');
        }
    } else {
      browser.close();
    }
    var data = predicData;
    if(data.length) {
      let productData = await getProductData();
      let arr = [];
      let arr1 = [];

      for(let i = 0; i < productData.length; i++) {
        let nongga_product = JSON.parse(productData[i].nongga_product);
        productData[i].nongga_product = nongga_product
      }
      for(let i = 0; i < data.length; i++) {
        let json = {}
        let insertArr = []
        for(let v = 0; v < productData.length; v++) {
          for(let k = 0; k < productData[v].nongga_product.length; k++) {
            if(data[i].productCode === productData[v].nongga_product[k].code) {
              json['product_name'] = productData[v].nongga_product[k].name;
              json['product_code'] = productData[v].nongga_name;
              json['product_cnt'] = data[i].cnt;
              json['gong_price'] = parseInt(productData[v].nongga_product[k].gongprice) * parseInt(data[i].cnt)
              json['platform'] = data[i].platform;
              insertArr = [productData[v].nongga_product[k].name, productData[v].nongga_name, data[i].cnt, parseInt(productData[v].nongga_product[k].gongprice) * parseInt(data[i].cnt), data[i].platform]

            }
          }
        }
        arr.push(json);
        if(insertArr.length) {
          arr1.push(insertArr)
        }
      }
      console.log(arr1)
      await deletePredictData();
      await saveAllData(arr1);
      //await processArray(arr)
      console.log('저장완료');
    }
    //
  } catch (e) {
    console.error(e);
    await browser.close();
    if (e) main();
  }
}

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

async function eleven() {
  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10).replace(/-/g, '') + ("00" + currentDate.getHours()).slice(-2) + ("00" + currentDate.getMinutes()).slice(-2);
  const currentDate1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);
  const preMonth = currentDate1.toISOString().slice(0, 10).replace(/-/g, '') + ("00" + currentDate.getHours()).slice(-2) + ("00" + currentDate.getMinutes()).slice(-2);
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
          resultToJson = json['ns2:orders']['ns2:order'];
          resolve(resultToJson);
        });
      } catch (e) {
        reject(e);
      }

    });
  });
}




