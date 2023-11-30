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
var crypto = require('crypto');
/* GET home page. */

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

async function savePredictData () {
  let data = await main();
  if(data === 0) {
    data = await main();
  }
  console.log(data.length)
  let productData = await getProductData();
  let arr = [];
  for(let i = 0; i < productData.length; i++) {
    let nongga_product = JSON.parse(productData[i].nongga_product);
    productData[i].nongga_product = nongga_product
  }
  for(let i = 0; i < data.length; i++) {
    let json = {}
    for(let v = 0; v < productData.length; v++) {
      for(let k = 0; k < productData[v].nongga_product.length; k++) {
        if(data[i].productCode === productData[v].nongga_product[k].code) {
          json['product_name'] = productData[v].nongga_product[k].name;
          json['product_code'] = productData[v].nongga_name;
          json['product_cnt'] = data[i].cnt;
          json['gong_price'] = parseInt(productData[v].nongga_product[k].gongprice) * parseInt(data[i].cnt)
          json['platform'] = data[i].platform;
        }
      }
    }

    arr.push(json);
  }
  await deletePredictData();
  await processArray(arr)
}

function delay(data) {
  pool.getConnection(function(err, conn) {
    conn.query('INSERT INTO predict SET ?', data , function(err, res, fields) {
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
  let predicData = [];
  const coupangData = await coupang();
  if (coupangData.length !== 0) {
    coupangData.forEach((data) => {
      data.orderItems.forEach((item) => {
        const cData = {};
        cData.platform = '쿠팡';
        cData.productCode = item.externalVendorSkuCode;
        cData.productCnt = item.shippingCount;
        predicData.push(cData);
      });
    });
  }

  const elevenData = await eleven();
  if (elevenData) {
    console.log('11번가 성공')
    elevenData.forEach( (data) => {
      const eData = {};
      eData.platform = '11번가';
      eData.productCode = data.sellerPrdCd[0];
      eData.productCnt = data.ordQty[0];
      predicData.push(eData);
    });
  }

  const naverData = await naver();
  console.log(naverData)
  if (naverData) {
    console.log('네이버 성공')
    predicData = predicData.concat(naverData)
  }
  console.log(predicData)
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
          resultToJson = json['ns2:orders']['ns2:order'];
          resolve(resultToJson);
        });
      } catch (e) {
        reject(e);
      }

    });
  });
}

async function naver () {
  const browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  async function xClick (page, path) {
    await page.waitForXPath(path)
    const ele = (await page.$x(path))[0]
    await ele.click()
  }
  async function getXEleText (page, path) {
    return new Promise(async (resolve) => {
      await page.waitForXPath(path)
      const xPath = (await page.$x(path))[0]
      const text = await page.evaluate(el => el.textContent.trim(), xPath)
      resolve(text)
    })
  }
  try {
    const page = await browser.newPage()
    page.on('dialog', async (dialog) => {
      await dialog.accept()
    })
    page.setViewport({ width: 0, height: 0 })
    await page.goto('https://sell.smartstore.naver.com/#/login', 'networkidle0')
    await page.waitForSelector('#loginId')
    await page.click('#loginId')
    await page.keyboard.type('dlxoghk1')
    await page.click('#loginPassword')
    await page.keyboard.type('hwa30102##')
    await page.click('#loginButton')
    await page.waitForXPath('//span[@class = "shop"]')
    const storeName = await getXEleText(page, '//span[@class = "shop"]')
    if (storeName !== '창원아재들') {
      await xClick(page, '//a[text() = "스토어 이동 "]')
      await xClick(page, `//span[contains(@class, "text-title") and text() = "창원아재들"]`)
      await page.waitFor(3000)
    }
    await page.waitFor(3000)
    const modalEle = (await page.$x('//button[@class = "close"]'))
    const modalCnt = modalEle.length
    if (modalCnt > 0) {
      for (let i = 0; i < modalCnt; i++) {
        const modalClose = modalEle[i]
        await modalClose.click()
        await page.waitFor(2000)
      }
    }
    const newOrderNum = await getXEleText(page, '//a[@data-nclicks-code = "orddel.new"]')
    console.log(newOrderNum)
    if (newOrderNum > '0') {
      // await xClick(page, '//a[@data-nclicks-code = "orddel.new"]')
      await page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery', 'networkidle0')
      // await page.waitForNavigation('networkidle0')
      await page.waitForSelector('#__naverpay')
      await page.waitFor(3000)
      let frame = ''
      await page.frames().forEach((f) => {
        if (f.name() === '__naverpay') {
          frame = f
        } // 'https://sell.smartstore.naver.com/o/v3/iframe/n/sale/delivery'
      })

      await frame.waitForXPath('//label[text() = "100개씩 보기"]/following-sibling::select')
      await frame.select('#__app_root__ > div > div.napy_sub_content > div:nth-child(3) > div.npay_sub_heading > div > div:nth-child(2) > select', '500')
      const trLength = (await frame.$x('//td[@data-column-name = "productOrderNo"]/div/a')).length
      const getPredic = async function () {
        let predicData = []
        for (let i = 0; i < trLength; i++) {
          let json = {}
          const orderQuantity = await getXEleText(frame, `(//td[@data-column-name = "orderQuantity"]/div)[${i + 1}]`)
          const optionCode = await getXEleText(frame, `(//td[@data-column-name = "sellerOptionManagementCode"]/div)[${i + 1}]`)
          const productCode = await getXEleText(frame, `(//td[@data-column-name = "sellerProductManagementCode"]/div)[${i + 1}]`)
          json.productCnt = orderQuantity
          json.platform = '네이버'
          if (optionCode) {
            json.productCode = optionCode
          } else {
            json.productCode = productCode
          }
          predicData.push(json)
        }
        return predicData
      }

      const npayNavi = await frame.$$('.npay_paginate > a')
      if (npayNavi.length === 0) {
        const data = await getPredic()
        return data
      } else if (npayNavi.length > 0) {
        let data = []
        for (let i = 0; i < npayNavi.length; i++) {
          const arr = await getPredic()
          data = data.concat(arr)
          if (npayNavi.length - 1 !== i) {
            await frame.click(`.npay_paginate > a:nth-child(${i + 2})`)
            await frame.waitFor(3000)
          }
        }
        return data
      }
    } else if (newOrderNum === '0') {
      return []
    }
    await browser.close()
  } catch (e) {
    if (e) console.log(e)
    await browser.close()
  }
}

main()