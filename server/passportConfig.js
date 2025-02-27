const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Match user
    User.findOne({ email: email }).then(user => {
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' });
        }
      });
    }).catch(err => console.error(err));
  }));


  // JWT strategy for token-based authentication (mobile)
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret',
  };

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log('JWT payload:', jwt_payload);
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user); // User authenticated with JWT
          } else {
            return done(null, false);
          }
        })
        .catch(err => done(err, false));
    })
  );


  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user)).catch(err => {
      console.error(err);
      done(null);
    });
  });
};
