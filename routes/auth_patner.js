var passport_patner = require('passport');
var settings = require('../config/settings');
require('../config/passport_patner')(passport_patner);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var pool = require('../config/mysql_info');
var crypto = require('crypto');
var admin = require("firebase-admin");

var serviceAccount = require("../config/cwpartner-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cwpartner-b3a7a.firebaseio.com"
});

router.post('/message', (req, res) => {
  var registrationToken = req.body.token;
  var message = {
    data: {
      score: '850',
      time: '2:45'
    },
    token: registrationToken
  };
  admin.messaging().send(message)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
})

function hasher_patner (pwd, salt, callback) {
  crypto.pbkdf2(pwd, salt, 98975, 64, 'sha512', (err, key) => {
      var password = key.toString('base64');
      callback(password);
  });
};

function findPatner(id, callback) {
  pool.getConnection(function(err, conn) {
      conn.query('SELECT * FROM product WHERE uid = ?', [id], function(err, rows, fields) {
          if(err) callback(err);
          callback(rows[0], err);
          conn.release();
      });
  });
}

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


/** 요기서부터 patner 프로그램 인증처리 */
router.post('/register', function(req, res) {
  if(!req.body.id || !req.body.password) {
      res.json({success: false, msg:'아이디와 비번을 입력해 주세요'});
  } else {
      var salt, password;
      crypto.randomBytes(64, (err,buf) => {
          salt = buf.toString('base64');

          crypto.pbkdf2(req.body.password, buf.toString('base64'), 98975, 64, 'sha512', (err, key) => {
              password = key.toString('base64');
              pool.getConnection(function(err, conn) {
                  conn.query('INSERT INTO user SET ?', {uid:req.body.id, id: req.body.id, password:password, salt:salt, username:req.body.name}, function(err, response, fields) {
                      if(err) throw err;
                      res.json({success:true, msg:'회원가입에 성공하셨습니다'});
                      conn.release();
                  })
              })
          })
      });
  }
});


router.post('/update', function(req, res) {
  //비번을 한번더 넣었을 때 똑같은지 아닌지 첵첵크 아이디는 못바꾸고 이름 비번만 바꿀수 있게
  var uid = req.body.uid
  if(req.body.pw !== req.body.rePw) {
      res.json({success: false, msg:'비밀번호와 다시 입력한 비밀번호가 일치하지 않습니다.'});
  } else {
      var salt, password;
      crypto.randomBytes(64, (err,buf) => {
          salt = buf.toString('base64');
          crypto.pbkdf2(req.body.pw, buf.toString('base64'), 98975, 64, 'sha512', (err, key) => {
              password = key.toString('base64');
              var row = findPatner(uid, (suc, err) => {
                let uid = suc.uid
                let sql = "UPDATE product SET pw = ?, salt = ? WHERE uid = ?"
                pool.getConnection(function(err, conn) {
                conn.query(sql, [password,salt,uid], function(err, response, fields) {
                    conn.release();
                    if(response) {
                      res.json({success:true});
                    }
                  });
                });
            });
          })
      });
  }
});

router.get('/', passport_patner.authenticate('jwt-2', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      let user = {
        nongga_ceo: req.user.nongga_ceo,
        nongga_name: req.user.nongga_name,
        nongga_phone: req.user.nongga_phone,
        nongga_product: req.user.nongga_product,
        template: req.user.template,
        conditinal_free: req.user.conditinal_free,
        uid: req.user.uid
      }
      res.json({success:true, user:user});
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});



router.post('/login', function(req, res) {
  var id = req.body.uid;
  var pwd = req.body.pw;
  var row = findPatner(id, function(suc, err) {
      hasher_patner(pwd, suc.salt, (password) => {
          if(suc.pw === password) {
              var token = jwt.sign({uid:suc.uid,name:suc.nongga_name}, settings.patner, {expiresIn: '240m'});
              res.json({success: true, token: 'JWT ' + token});
          } else {
              res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
      });
  });
});
/** 발주서 가져오기 */

// 날짜별 조회
router.get('/order/:date', passport_patner.authenticate('jwt-2', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      var date = req.params.date;
      pool.getConnection(function(err, conn) {
          conn.query('SELECT * FROM customer WHERE date = ? AND product_code = ?', [date, req.user.nongga_name] , function(err, response, fields) {
              res.send(response);
              conn.release();
          });
      });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.post('/template',passport_patner.authenticate('jwt-2', { session: false}), function(req, res) {
  console.log(req.body)
  if(!req.body.template) {
      res.json({success: false, msg:'템플릿을 적어 주세요'});
  } else {
    pool.getConnection(function(err, conn) {
      const sql = "UPDATE product SET template = ? WHERE uid = ?"
      conn.query(sql, [req.body.template, req.body.uid], function(err, response, fields) {
        if(err) throw err;
        res.json({success:true, msg:'템플릿 등록 성공!'});
        conn.release();
      })
    })
  }
});

//기간조회
router.get('/order/:date1/:date2', passport_patner.authenticate('jwt-2', { session: false}), function(req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        var sql = 'SELECT * FROM customer WHERE DATE(date) BETWEEN ' + pool.escape(req.params.date1) + ' AND ' + pool.escape(req.params.date2) + ' AND product_code=' + pool.escape(req.user.nongga_name);
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

router.get('/predict', passport_patner.authenticate('jwt-2', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      pool.getConnection(function(err, conn) {
          conn.query('SELECT * FROM predict WHERE product_code = ?', [req.user.nongga_name] , function(err, response, fields) {
              res.send(response);
              conn.release();
          });
      });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

module.exports = router;
