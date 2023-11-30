var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var pool = require('./mysql_info');

    //로드 유저 모델

var settings = require('./settings');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = settings.patner;
    passport.use('jwt-2', new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        pool.getConnection(function(err, conn) {
            conn.query('SELECT * FROM product WHERE uid = ?', [jwt_payload.uid], function(err, rows, fields) {
                if(err) {
                    return done(err, false);
                }
                var user = rows[0];
                if(user) {
                    done(null, user)
                } else {
                    done(null, false);
                }
                conn.release();
            });
        });
    }));
}