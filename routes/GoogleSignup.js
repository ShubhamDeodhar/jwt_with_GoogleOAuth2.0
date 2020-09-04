const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');
const User = require('../modals/user');
const jwt = require('jsonwebtoken');
const cookieSession = require('cookie-session');

//to support sessions in passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get('googleClientId'),
      clientSecret: config.get('googleClientSecret'),
      callbackURL: 'auth/google/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          return cb(err, false);
        }
        if (!err && user !== null) {
          console.log('existing user');
          return cb(null, user);
        } else {
          user = new User({ name: profile.displayName });
          user.googleId = profile.id;
          console.log('new user');
          user.save((err, user) => {
            if (err) return cb(err, false);
            else return cb(null, user);
          });
        }
      });
    }
  )
);

router.get(
  '/',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/callback', passport.authenticate('google'), (req, res) => {
  console.log(req.user);
  if (req.user) {
    const payload = {
      user: req.user.id,
    };
    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600000 },
      (err, token) => {
        if (err) return err;
        else res.json({ token: token });
      }
    );
  }
});
router.get('/currentUser', (req, res) => {
  res.send(req.user);
});
router.get('/logout', (req, res) => {
  req.logOut();
  res.send(req.user);
});

module.exports = router;
