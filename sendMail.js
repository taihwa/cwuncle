const nodemailer = require('nodemailer')
const xlsx = require('xlsx')

async function sendMail() {
  const json = [
    {
      '주문자' : '이태화',
      '주소' : '남아프리카공화국',
    },
    {
      '주문자' : '손흥민',
      '주소' : '제주도',
    },
    {
      '주문자' : '김치만',
      '주소' : '공룡나라',
    }
  ]
  let workbook = xlsx.utils.book_new()
  let worksheet = xlsx.utils.json_to_sheet(json)
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
  let opts = {bookType:'xlsx', bookSST:false, type:'buffer'}
  let wbout = xlsx.write(workbook, opts)
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
      to: 'dlxoghk1@naver.com',
      subject: '2020-04-20 창원아재들 주문건입니다',
      html: '<p>감사합니다.</p>',
      attachments: [
        {
          filename: '창원아재들-2020-04-02.xlsx',
          content: new Buffer(wbout,'utf-8')
        }
      ]
    }
    const transporter = nodemailer.createTransport(mailConfig)
    const result = await transporter.sendMail(message)
    console.log(result)
  } catch (e) {
    console.log(e)
  }
}

sendMail()