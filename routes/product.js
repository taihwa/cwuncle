var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var pool = require('../config/mysql_info');
var settings = require('../config/settings');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'dist/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

function hasher_patner (pwd, salt, callback) {
  crypto.pbkdf2(pwd, salt, 98975, 64, 'sha512', (err, key) => {
      var password = key.toString('base64');
      callback(password);
  });
};

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

router.post('/info', passport.authenticate('jwt-1', { session: false}), function(req,res) {
  var token = getToken(req.headers);
  var data = req.body;
    if (token) {
      pool.getConnection(function(err,conn) {
        conn.query('INSERT INTO product_info SET ?', data, function(err, response) {
          if(err) throw err;
          if(response) {
            res.send('ok');
          }
          conn.release();
        })
      })
      res.send("ok");
    } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
    }
});

router.get('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
    pool.getConnection(function(err, conn) {
      conn.query('SELECT * FROM product', function(err, response, fields) {
          res.send(response);
          conn.release();
      });
     });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.get('/excel', function(req, res, next) {
  var apiKey = req.query.apiKey
  const product = [];
  if (apiKey === 'dkdldb86') {
    pool.getConnection(function(err, conn) {
      conn.query('SELECT nongga_name, nongga_product FROM product', function(err, response, fields) {
          for(let i = 0; i < response.length; i++) {
            let json = JSON.parse(response[i].nongga_product)
            response[i].nongga_product = json
          }
          res.send(response);
          conn.release();
      });
     });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.get('/nokja', function(req, res, next) {
  const apiKey = req.query.apiKey
  // const productCode = req.query.productCode
  const product = [];
  if (apiKey === 'cwuncle') {
    pool.getConnection(function(err, conn) {
      conn.query('SELECT nongga_product FROM product', function(err, response, fields) {
          for(let i = 0; i < response.length; i++) {
            let json = JSON.parse(response[i].nongga_product)
            for(let k = 0; k < json.length; k++ ) {
              product.push(json[k])
            }
          }
          res.send(product);
          conn.release();
      });
     });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.post('/', passport.authenticate('jwt-1', { session: false}), function(req,res) {
  var token = getToken(req.headers);
  var data = req.body;
    if (token) {
      pool.getConnection(function(err,conn) {
        conn.query('INSERT INTO product SET ?', data, function(err, response) {
          if(err) throw err;
          if(response) {
            res.send('ok');
          }
          conn.release();
        })
      })
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
});

router.put('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  var data = req.body;
  if (token) {
    let sql = "UPDATE product SET nongga_name = ?, nongga_num = ?, nongga_ceo = ?, nongga_phone = ?, nongga_product = ?, conditinal_free = ?, order_type = ?, sign_img = ?  WHERE num = ?"
    pool.getConnection(function(err, conn) {
    conn.query(sql, [data.nongga_name,data.nongga_num,data.nongga_ceo,data.nongga_phone, data.nongga_product, data.conditinal_free, data.order_type, data.signImg, data.num], function(err, response, fields) {
        if (err) console.log(err)
        conn.release();
        if(response) {
          res.json({success:true})
          console.log(response);
        }
      });
    });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.delete('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  var num = req.query.key
  if (token) {
    let sql = "DELETE FROM product WHERE num = ?"
    pool.getConnection(function(err, conn) {
    conn.query(sql, num, function(err, response, fields) {
        conn.release();
        if(response) {
          res.send('ok');
          console.log(response);
        }
      });
    });
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
})


router.post('/imgupload', upload.single('imgfile'), (req,res) => {
  console.log('req.file',req.file.path)
  var imgPath = req.file.path;
  var splitPath = imgPath.split('dist')
  var sendPath = splitPath[1]
  console.log(splitPath)
  res.json({success: true, path : sendPath})

});

router.put('/partner', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  var data = req.body;
  if (token) {
    var salt, password;
      crypto.randomBytes(64, (err,buf) => {
          salt = buf.toString('base64');
          crypto.pbkdf2(data.pw, buf.toString('base64'), 98975, 64, 'sha512', (err, key) => {
            password = key.toString('base64');
            let sql = "UPDATE product SET uid = ?, pw = ?, salt = ? WHERE num = ?"
            pool.getConnection(function(err, conn) {
            conn.query(sql, [data.uid, password, salt, data.num], function(err, response, fields) {
                conn.release();
                if(response) {
                  res.send('ok');
                  console.log(response);
                }
              });
            });
          })
      });

  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

router.get('/template', passport.authenticate('jwt-1', { session: false}), function(req, res) {
  var token = getToken(req.headers)
  if (token) {
    pool.getConnection(function(err, conn) {
      const sql = "SELECT template FROM product WHERE num = ?"
      conn.query(sql, [req.query.num], function(err, response, fields) {
        if(err) throw err;
        let json = JSON.parse(response[0].template)

        res.json({success:true, data: json});
        conn.release();
      })
    })
  }
});

router.post('/template', passport.authenticate('jwt-1', { session: false}), function(req, res) {
  var token = getToken(req.headers)
  if (token) {
    if(!req.body.template) {
        res.json({success: false, msg:'템플릿을 적어 주세요'});
    } else {
    pool.getConnection(function(err, conn) {
      const sql = "UPDATE product SET template = ? WHERE num = ?"
      conn.query(sql, [req.body.template, req.body.num], function(err, response, fields) {
        if(err) throw err;
        res.json({success:true, msg:'템플릿 등록 성공!'});
        conn.release();
      })
    })
  }
  }
});



module.exports = router;