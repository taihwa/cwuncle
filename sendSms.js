const axios = require('axios')
var unirest = require("unirest")
function getNowDate () {
  var now = new Date()
  var date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  date = date.toISOString().slice(0, 10).replace(/-/g, '-')
  return date
}

function sendSms () {
  axios({
    method: 'post',
    url: 'http://api.apistore.co.kr/ppurio/1/message/sms/blackbagsoft',
    headers: {
      'x-waple-authorization': 'NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ==',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    data: {
      'dest_phone': '01028031754',
      'send_phone': '01030640144',
      'msg_body': '내용'
    }
  }).then((data) => {
    console.log(data)
  })
}
sendSms()
    /*
    const result = await axios({
      method: 'post',
      url: 'http://api.apistore.co.kr/ppurio/1/message/sms/blackbagsoft',
      headers: {
        'x-waple-authorization': 'NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ==',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        'dest_phone': '01028031754',
        'send_phone': '01030640144',
        'msg_body': '내용'
      }
    })
    console.log(result)
    return result
  } catch (e) {
    console.log(11)
    console.log(e)
  }
}

sendSms()
/*
HttpResponse response = Unirest.POST ("http://api.apistore.co.kr/ppurio/{apiVersion}/message/lms/{id}")
.header("x-waple-authorization", "NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ==")
.field("send_time", "1363255965")
.field("dest_phone", "01055556666")
.field("dest_name", "홍길동")
.field("send_phone", "01077778888")
.field("send_name", "홍길순")
.field("subject", "제목")
.field("msg_body", "내용(2000 byte 미만)")
.field("apiVersion", "1")
.field("id", "")
.asJson();

HttpResponse response = Unirest.GET ("http://api.apistore.co.kr/ppurio/{apiVersion}/message/report/{id}")
.header("x-waple-authorization", "NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ==")
.field("cmid", "20130302143001000")
.field("id", "apitest1234")
.field("apiVersion", "1")
.asJson();

HttpResponse response = Unirest.GET ("http://api.apistore.co.kr/ppurio/{apiVersion}/message/balance/{id}/{balance_date}")
.header("x-waple-authorization", "NzQ2MS0xNTE2Njg3NzMwNjMyLTI1NzBkNjg2LTc4NTktNGNjMi1iMGQ2LTg2Nzg1OWJjYzIzZQ==")
.field("id", "apitest1234")
.field("balance_date", "201612")
.field("apiVersion", "1")
.asJson();
*/