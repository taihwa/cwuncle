var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var pool = require('../config/mysql_info');
var app = express();

router.get('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      pool.getConnection(function(err, conn) {
        conn.query('SELECT * FROM jung_san WHERE tjungsan_price IS NULL ORDER BY date', function(err, response, fields) {
          res.send(response);
          conn.release();
        });
    });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

//기간조회
router.get('/:date1/:date2', function(req, res, next) {
  var apiKey = req.query.apiKey;
  if (apiKey === 'dlxoghkWkd') {
      var sql = 'SELECT * FROM jung_san WHERE DATE(date) BETWEEN ' + pool.escape(req.params.date1) + ' AND ' + pool.escape(req.params.date2);
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

router.get('/complete', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      pool.getConnection(function(err, conn) {
        conn.query('SELECT * FROM jung_san WHERE tjungsan_price IS NOT NULL ORDER BY date', function(err, response, fields) {
          res.send(response);
          conn.release();
        });
    });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.post('/update', passport.authenticate('jwt-1', { session: false}), (req, res, next) => {

  var token = getToken(req.headers);
    if (token) {
      pool.getConnection(function(err, conn) {
        conn.query('INSERT IGNORE INTO jung_san (platform, date, order_num, product_code, shop_name, product_name, cnt, gong_price, fjungsan_price, tjungsan_price) VALUES ? ', [req.body], function(err, response, fields) {
          if (err) return err;
          conn.release();
          res.send({success:true});
        });
       });
    } else {
      res.status(403).send({success: false, msg: '인증안됨'});
    }
});

router.put('/', async (req, res) => {
  var apiKey = req.query.apiKey;
  if (apiKey === 'dlxoghkWkd') {
  var data = [];
  for (let i in req.body) {
    // num, gongprice, fjungsan_price, pure_price
    if (req.body[i][0]) {
      let arr = [req.body[i][6].toString(), req.body[i][7].toString(), req.body[i][8], req.body[i][0]]
      data.push(arr)
    }
  }
  await processArray(data)
  res.send('ok')
  } else {
    res.status(403).send({success: false, msg: '인증안됨'});
  }
  function delay(data) {
    pool.getConnection(function(err, conn) {
      conn.query('UPDATE jung_san SET gong_price = ?, fjungsan_price = ?, pure_price = ? WHERE num = ?', data, function(err, response, fields) {
        if (err) return res.send(err);
        conn.release();
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
  }
});

router.put('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    const jungsanData = req.body
    let updateData = []
    for (let i = 0; i < jungsanData.length; i++) {
      if (jungsanData[i].tjungsan_price) {
        let arr = [jungsanData[i].tjungsan_price, jungsanData[i].pure_price, jungsanData[i].order_num]
        updateData.push(arr)
      }
    }
    processArray(updateData)

  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

module.exports = router;