var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var pool = require('../config/mysql_info');

    //로드 유저 모델

var settings = require('../config/settings');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = settings.secret;
    passport.use('jwt-1', new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        pool.getConnection(function(err, conn) {
            conn.query('SELECT * FROM user WHERE id = ?', [jwt_payload.id], function(err, rows, fields) {
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