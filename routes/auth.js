var passport = require('passport');
var settings = require('../config/settings');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var pool = require('../config/mysql_info');
var crypto = require('crypto');

function hasher (pwd, salt, callback) {
    crypto.pbkdf2(pwd, salt, 1897548, 64, 'sha512', (err, key) => {
        var password = key.toString('base64');
        callback(password);
    });
};

function hasher_patner (pwd, salt, callback) {
  crypto.pbkdf2(pwd, salt, 98975, 64, 'sha512', (err, key) => {
      var password = key.toString('base64');
      callback(password);
  });
};

getToken = function (headers) {
  console.log(headers)
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


router.post('/register', function(req, res) {
    console.log(req.body.id);
    if(!req.body.id || !req.body.password) {
        res.json({success: false, msg:'아이디와 비번을 입력해 주세요'});
    } else {
        var salt, password;
        crypto.randomBytes(64, (err,buf) => {
            salt = buf.toString('base64');

            crypto.pbkdf2(req.body.password, buf.toString('base64'), 1897548, 64, 'sha512', (err, key) => {
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

router.get('/', passport.authenticate('jwt-1', { session: false}), function(req, res, next) {
  var token = getToken(req.headers);
  if (token) {
      res.send("ok");
  } else {
      return res.status(403).send({success: false, msg: '인증안됨'});
  }
});

function findUser(id, callback) {
    pool.getConnection(function(err, conn) {
        conn.query('SELECT * FROM user WHERE id = ?', [id], function(err, rows, fields) {
            if(err) callback(err);
            callback(rows[0], err);
            conn.release();
        });
    });
}

router.post('/login', function(req, res) {
    var id = req.body.id;
    var pwd = req.body.password;
    var row = findUser(id, function(suc, err) {
        console.log(suc);
        hasher(pwd, suc.salt, function(password) {
            if(suc.password === password) {
                console.log("비번 일치")
                var token = jwt.sign({id:suc.id,name:suc.username}, settings.secret, {expiresIn: '240m'});
                res.json({success: true, token: 'JWT ' + token});
            } else {
                console.log("불일치")
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
            }
        });
    });
});


module.exports = router;
