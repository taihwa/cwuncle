var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);
var pool = require('../config/mysql_info');

function customer_callback(len, num, customer) {
    if(num === len) return 'ok';
    if(num < len) {
        var data = customer[num]
        pool.getConnection(function(err, conn) {
            conn.query('INSERT INTO customer SET ?', data , function(err, res, fields) {
                if(err) throw err;
                if(res) {
                    customer_callback(len, num+1, customer);
                }
                conn.release();
                console.log(res)
            })
        });
    }
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


/* GET ALL BOOKS */
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    var token = getToken(req.headers); 
    if (token) {
        pool.getConnection(function(err, conn) {
            conn.query('SELECT * FROM book', function(err, response, fields) {
                res.send(response);
                conn.release(); 
            });
        });
        res.send("ok");
    }
});

/* GET SINGLE BOOK BY ID */
router.get('/:id', function(req, res, next) {

});

/* SAVE BOOK */
router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        customer = req.body;
        var len = customer.length;
        customer_callback(len, 0, customer);
    } else {
        return res.status(403).send({success: false, msg: '인증안됨'});
    }
});

/* UPDATE BOOK */
router.put('/:id', function(req, res, next) {

});

/* DELETE BOOK */
router.delete('/:id', function(req, res, next) {

});

module.exports = router;
