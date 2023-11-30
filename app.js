var express = require('express');
var http = require('http');
var path = require('path');
var vhost = require('vhost');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var auth = require('./routes/auth');
var auth_patner = require('./routes/auth_patner');
var book = require('./routes/book');
var jumun = require('./routes/jumun');
var kakao = require('./routes/kakao');
var nospo = require('./routes/nospo');
var product = require('./routes/product');
var jungsan = require('./routes/jungsan');
var cors = require('cors');
var app = express();

var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer)
httpServer.listen(3000, () => {
	console.log('3000번 포트 스타트111');
});
io.sockets.on('connection', function (socket) {
  console.log('client connect');
  socket.on('echo', function (data) {
      io.sockets.emit('update', data);
  });
});
// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});
var app1 = express();
var app2 = express();
app.use(cors())
app1.use(express.static(path.join(__dirname, 'dist1')));
app2.use(express.static(path.join(__dirname, 'dist2')));
app.use(vhost('partner.bagcw.com', app1));
app.use(vhost('todo.bagcw.com', app2));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app2.use(bodyParser.json({limit: '50mb'}));
app2.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/books', express.static(path.join(__dirname, 'dist')));
app.use('/book', book);
app.use('/jumun', jumun);
app.use('/api/auth', auth);
app.use('/kakao', kakao);
app2.use('/nospo', nospo);
app.use('/product', product);
app.use('/auth_patner', auth_patner);
app.use('/jungsan', jungsan);

// Certificate
var privateKey = fs.readFileSync('/etc/letsencrypt/live/bagcw.com/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/bagcw.com/cert.pem', 'utf8');
var ca = fs.readFileSync('/etc/letsencrypt/live/bagcw.com/chain.pem', 'utf8');

var credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};


// catch 404 and forward to error handler
app.use(function(error, req, res, next) {
  console.log(error)
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// restful api error handler
app.use(function(err, req, res, next) {
  console.log(err);

  if (req.app.get('env') !== 'development') {
      delete err.stack;
  }

    res.status(err.statusCode || 500).json(err);
});

module.exports = app;
