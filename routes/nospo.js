var express = require('express');
var router = express.Router();
var pool = require('../config/mysql_info');
var multer = require('multer');
var path = require('path');
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(__dirname)
      cb(null, 'dist/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});

router.post('/', upload.single('image'), function (req, res) {

  console.log('req.file',req.file.path)
  var imgPath = req.file.path;
  var splitPath = imgPath.split('dist')
  var sendPath = splitPath[1]
  console.log(sendPath)
  res.send(sendPath)
  //res.json({success:'ok'})
});

router.get('/detail', function(req, res, next) {
  console.log(111)
  pool.getConnection(function(err, conn) {
    conn.query('SELECT * FROM nospo', function(err, response, fields) {
        res.send(response);
        conn.release();
    });
  });
});

router.get('/detail/:id', function(req, res, next) {
  var id = req.params.id
  console.log(id)
  pool.getConnection(function(err, conn) {
      conn.query('SELECT * FROM nospo WHERE ?',{num: id}, function(err, response, fields) {
          console.log(response)
          res.send(response);
          conn.release();
      });
  });
});

router.post('/detail', function(req, res) {
  pool.getConnection(function(err,conn) {
    conn.query('INSERT INTO nospo SET ?', req.body, function(err, response) {
      if(err) throw err;
      if(response) {
        res.send('ok');
      }
      conn.release();
    })
  })
})

router.put('/detail', function(req, res, next){
  console.log(req.body)
    var title = req.body.title;
    var text = req.body.text;
    var num = req.body.num;
    var main1 = req.body.main1
    var main2 = req.body.main2
    var check1 = req.body.check1
    var who1 = req.body.who1
    var who2 = req.body.who2
    var where1 = req.body.where1
    var where2 = req.body.where2
    var how1 = req.body.how1
    var how2 = req.body.how2
    var how3 = req.body.how3
    var eat1 = req.body.eat1
    var eat2 = req.body.eat2
    var eat3 = req.body.eat3
    var delivery1 = req.body.delivery1
    var delivery2 = req.body.delivery2
    var subtitle = req.body.subtitle
    var main_story = req.body.main_story
    var who_title1 = req.body.who_title1
    var who_title2 = req.body.who_title2
    var who_subtitle = req.body.who_subtitle
    var who_story = req.body.who_story
    var where_title = req.body.where_title
    var where_story = req.body.where_story
    var how_title1 = req.body.how_title1
    var how_story1 = req.body.how_story1
    var how_title2 = req.body.how_title2
    var how_story2 = req.body.how_story2
    var eat_title = req.body.eat_title
    var eat_story = req.body.eat_story
    var delivery_title = req.body.delivery_title
    var delivery_story = req.body.delivery_story
    var product_info_name = req.body.product_info_name
    var product_info_gusung = req.body.product_info_gusung
    var product_info_maker = req.body.product_info_maker
    var product_info_wonsanji = req.body.product_info_wonsanji
    var product_info_wonjae = req.body.product_info_wonjae
    var product_info_bogwan1 = req.body.product_info_bogwan1
    var product_info_bogwan2 = req.body.product_info_bogwan2
    num = parseInt(num)
    var sql = 'UPDATE nospo SET title = ?, text = ?, main1 = ?, main2 = ?, check1 = ?, who1 = ?, who2 = ?, where1 = ?, where2 = ?, how1 = ?, how2 = ?, how3 = ?, eat1 = ?, eat2 = ?, eat3 = ?, delivery1 = ?, delivery2 = ?, subtitle = ?, main_story = ?, who_title1 = ?, who_title2 = ?, who_subtitle = ?, who_story = ?, where_title = ?, where_story = ?, how_title1 = ?, how_story1 = ?, how_title2 = ?, how_story2 = ?, eat_title = ?, eat_story = ?, delivery_title = ?, delivery_story = ?, product_info_name = ?, product_info_gusung = ?, product_info_maker = ?, product_info_wonsanji = ?, product_info_wonjae = ?, product_info_bogwan1 = ?, product_info_bogwan2 = ? WHERE num = ?'
    pool.getConnection(function(err, conn) {
        conn.query(sql, [title,text,main1,main2,check1,who1,who2,where1,where2,how1,how2,how3,eat1,eat2,eat3,delivery1,delivery2,subtitle,main_story,who_title1,who_title2,who_subtitle,who_story,where_title,where_story,how_title1,how_story1,how_title2,how_story2,eat_title,eat_story,delivery_title,delivery_story,product_info_name,product_info_gusung,product_info_maker,product_info_wonsanji,product_info_wonjae,product_info_bogwan1,product_info_bogwan2,num] , function(err, response, fields) {
            if(err) throw err;
            if(response) {
                console.log(response)
                res.send('ok')
            }
            conn.release();
        })
    })
})

router.delete('/detail/:id', function(req, res) {
  console.log(req.params)
    var num = req.params.id
    num = parseInt(num)
    pool.getConnection(function(err, conn) {
        conn.query('DELETE from nospo WHERE num = ?',num, function(err, response, fields) {
            if(err) throw err;
            if(response) {
                res.send('ok')
            }
            conn.release();
        })
    })
})

module.exports = router;
