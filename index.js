const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { AppError } = require('./errors/AppError');
const cafeRouter = require('./routers/cafeRouter');
const reviewRouter = require('./routers/reviewRouter')
const session = require('express-session')
const flash = require('connect-flash')


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

const sessionOptions ={
  secret: 'tempsecret',
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
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  console.log(res.locals.success)
  next()
})

// routers
app.use('/cafes', cafeRouter);
app.use('/reviews', reviewRouter)

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