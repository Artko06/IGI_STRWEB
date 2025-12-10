const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./auth.config');
const db = require('../models');
const User = db.user;
const Role = db.role;
const jwt = require('jsonwebtoken'); 
 
passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleAuth.clientID,
      clientSecret: config.googleAuth.clientSecret,
      callbackURL: config.googleAuth.callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          const defaultRole = await Role.findOne({ name: 'user' });
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
            roles: [defaultRole._id],
          });

          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
