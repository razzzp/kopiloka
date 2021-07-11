const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const Cafe = require('./models/cafe');
const CafeValidator = require('./models/cafeValidator');
const Review = require('./models/review');
const ReviewValidator = require('./models/reviewValidator');
const { catchAsync } = require('./utils/catchAsync');
const { AppError } = require('./errors/AppError');


mongoose.connect('mongodb://localhost/kopiloka', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to the database...");
});

const app = express();
const port = 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(expressLayouts);

app.get('/cafes', catchAsync(async function (req, res) {
  const cafes = await Cafe.find();
  const locals = {
    title: "Cafes"
  };
  res.render('cafes/index', { locals, cafes });
}));

app.post('/cafes', catchAsync(async function (req, res) {
  const defaultImgUrls = {
    "raw": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1",
    "full": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=85",
    "regular": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=1080",
    "small": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=400",
    "thumb": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=200"
  };
  const { cafe } = req.body;
  cafe.imgUrls = defaultImgUrls;
  CafeValidator.validate(cafe);
  const newCafe = await new Cafe(cafe).save();
  res.redirect('/cafes');
}));

app.get('/cafes/new', function (req, res) {
  const locals = {
    title: "New Cafe"
  };
  res.render('cafes/new', { locals });
});

app.get('/cafes/:id', catchAsync(async function (req, res) {
  const { id } = req.params;
  const cafe = await Cafe.findById(id);
  cafe.myReviews = await Cafe.getReviews(cafe);
  const locals = {
    title: cafe.name
  };
  // console.log(cafe.imgUrls)
  // console.log(cafe.myReviews);
  res.render('cafes/details', { locals, cafe });
}));

app.delete('/cafes/:id', catchAsync(async function (req, res) {
  const { id } = req.params;
  const reviews = await Review.deleteMany({myOwner: id})
  const cafe = await Cafe.findByIdAndDelete(id);
  res.redirect('/cafes');
}));

app.put('/cafes/:id', catchAsync(async function (req, res) {
  const { id } = req.params;
  const { cafe } = req.body;
  CafeValidator.validate(cafe);
  const updatedCafe = await Cafe.findByIdAndUpdate(id, cafe);
  res.redirect(`/cafes/${updatedCafe._id}`);
}));

app.get('/cafes/:id/edit', catchAsync(async function (req, res) {
  const { id } = req.params;
  const cafe = await Cafe.findById(id);
  const locals = {
    title: `Edit ${cafe.name}`
  };
  res.render('cafes/edit', { locals, cafe });
}));

app.post('/cafes/:id/reviews', catchAsync(async function(req, res){
  const { id } = req.params;
  const { review } = req.body;
  ReviewValidator.validate(review)
  const newReview = new Review(review);
  newReview.myOwner = mongoose.Types.ObjectId(id);
  await newReview.save();
  res.redirect(`/cafes/${id}`);
}));

app.delete('/reviews/:id', catchAsync(async function(req, res){
  const { id } = req.params;
  const { fromCafeId } = req.query;
  const review = await Review.findByIdAndDelete(id);
  if(fromCafeId)
    res.redirect(`/cafes/${fromCafeId}`);
  else
    res.redirect('/cafes');
}));

app.get('/', function (req, res) {
  const locals = {
    title: "Wololo"
  };
  res.render('index', { locals });
});

app.all('*', function (req, res) {
  //404 route
  throw new AppError("404 not found", 404);
});

app.use(function (err, req, res, next) {
  const { status = 500 } = err;
  res.status(status).render('error', { err });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}...`);
});