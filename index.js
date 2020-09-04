require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
var passport = require('passport');
const cookieSession = require('cookie-session');
const config = require('config');
const app = express();

connectDB();

//Body-parser provided by express
app.use(express.json({ extended: false }));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 100,
    keys: [config.get('cookieKey')],
  })
);

//define routes

//define PORT
const PORT = process.env.PORT || 5000;

//define Routes
app.use('/signup', require('./routes/registration'));
app.use('/signin', require('./routes/login'));
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth/google', require('./routes/GoogleSignup'));

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
