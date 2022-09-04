const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { AppError } = require('./errors/AppError');
const cafeRouter = require('./routers/cafeRouter');
const reviewRouter = require('./routers/reviewRouter');
const { userRouter } = require('./routers/userRouter');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { User } = require('./models/user');
var FileStore = require('session-file-store')(session);

mongoose.connect('mongodb://127.0.0.1:27017/kopiloka');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to the database...");
});

const app = express();
const port = 3000;

// set express config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

var fileStoreOptions = {};
// configure sessions
const sessionOptions ={
  secret: 'tempsecret',
  // store: new FileStore(fileStoreOptions),
  resave: false,
  saveUninitialized: true,
  cookie : {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge:  1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionOptions))
app.use(flash())

// configure passport local authentication
app.use(passport.initialize())
app.use(passport.session())
passport.use(User.createStrategy());
// app.use(passport.authenticate('session'))
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// locals helpers
app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.isLoggedIn = req.isAuthenticated();
  // console.log(res.locals.success)
  next()
})

// routers
app.use('/cafes', cafeRouter);
app.use('/reviews', reviewRouter);
app.use('/', userRouter);

// home route
app.get('/', function (req, res) {
  const locals = {
    title: "Wololo"
  };
  res.render('index', { locals });
});

// error routes
app.all('*', function (req, res) {
  //404 route
  throw new AppError("404 not found", 404);
});

app.use(function (err, req, res, next) {
  const { status = 500 } = err;
  res.status(status).render('error', { err });
});

// start server
app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});