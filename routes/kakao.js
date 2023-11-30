var express = require('express');
var Unirest = require('unirest');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);

router.post('/', passport.authenticate('jwt-1', { session: false}), async function(req,res) {
  var token = getToken(req.headers);
  if (token) {
    let data = req.body
    console.log(data)
    for (const item of data) {
      var result = await delayed(item)
      console.log(result)
    }
    res.send("ok")
  }
})

async function delayed(item) {
  await sendKakao(item)
}

function sendKakao(item) {
  console.log("sendKakao")
  var phone = item.phone;
  var name = item.name;
  var product_name = item.product_name + " - " + item.cnt
  var date = item.date; 
  var delivery = item.delivery;
  var songjang = item.songjang_num;
  var jumunja = item.jumunja
  var sau = item.sau;
  var get_time = new Date(date);
  
  get_time.setDate(get_time.getDate() + 1)
  get_time = get_time.toISOString().slice(0,10).replace(/-/g,"-");
  var temCode = item.kakaoTemplate;
  var msg = ""
  console.log(phone, name, product_name, date, delivery, songjang, jumunja, sau, temCode)
  if(temCode === "CU5") {
    msg = "▶ 상품명 : " +  product_name + "\r\n▶ 주문자명 : "+ name + "\r\n▶ 수취인명 : "+ name +"\r\n▶ 발송지연사유 : "+ sau + "\r\n\r\n문의사항 있으시면 카카오톡으로 문의 주시면 성실히 답변 드리겠습니다.\r\n카카오톡 문의 시간 : 아침 9:00 ~ 저녁 6:00"
  }else if(temCode === "CU6") {
    msg = "안녕하세요 창원아재들입니다. 저희 스토어를 이용해 주셔서 감사합니다. 주문하신 내역은 아래와 같습니다. 혹시 물건을 수령을 못하셨을 경우나 상품에 대한 문의사항이 있으신 경우 플러스 친구로 연락주세요~\r\n\r\n" + "\r\n- 상품 : " + product_name + "\r\n- 주문자명 : " + jumunja + "\r\n- 수취인명 : "+ name +"\r\n- 발송일 : "+date+"\r\n- 수령예정일 : "+get_time + "\r\n- 운송장번호 : "+delivery+" - "+songjang+"\r\n- 상품 먹는법/주의점/팁 : "+sau
  }
  console.log(msg)

  return new Promise(resolve => {
    Unirest.post ("http://api.apistore.co.kr/kko/1/msg/blackbagsoft")
    .header({'x-waple-authorization': 'NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ=='})
    .field("phone", phone)
    .field("callback", "01028031754")
    //.field("reqdate", "20160517000000")
    .field("msg", msg)
    .field("template_code", temCode)
    //.field("failed_type", "LMS")
    //.field("url", "www.apistore.co.kr")
    //.field("url_button_txt", "발송조회")
    //.field("failed_subject", "발송실패")
    //.field("failed_msg", "발송실패")
    .field("apiVersion", "1")
    .field("client_id", "blackbagsoft")
    //.field("btn_types", "배송조회")
    //.field("btn_txts", "배송조회")
    .end(function (result) {
      console.log(result.status, result.headers, result.body);
      resolve(result)
    })
  });
}
module.exports = router;