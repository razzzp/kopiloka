const express = require('express');
const mongoose = require('mongoose');
const {Cafe} = require('../models/cafe');
const {CafeValidator} = require('../models/cafeValidator');
const {Review} = require('../models/review');
const {ReviewValidator} = require('../models/reviewValidator');
const { catchAsync } = require('../utils/catchAsync');
const flash = require('connect-flash')
const passport = require('passport');
const { requireLogin, isAuthor } = require('../middlewares')

cafeRouter = express.Router();

cafeRouter.get('/', catchAsync(async function (req, res) {
  const cafes = await Cafe.find();
  const locals = {
    title: "Cafes"
  };
  res.render('cafes/index', { locals, cafes});
}));

cafeRouter.post('/',
  requireLogin, 
  catchAsync(async function (req, res) {
    const defaultImgUrls = {
      "raw": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1",
      "full": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=85",
      "regular": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=1080",
      "small": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=400",
      "thumb": "https://images.unsplash.com/photo-1601759226705-cf16b1630f5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMzUxODN8MHwxfHNlYXJjaHwxfHxjYWZlJTIwY29mZmVlfGVufDB8fHx8MTYyMjUxNjUxOQ&ixlib=rb-1.2.1&q=80&w=200"
    };
    const { cafe } = req.body;
    cafe.author = mongoose.Types.ObjectId(req.user._id);
    cafe.imgUrls = defaultImgUrls;
    CafeValidator.validate(cafe);
    const newCafe = await new Cafe(cafe).save();
    req.flash('success', 'Cafe has been successfully created!')
    res.redirect(`/cafes/${newCafe.id}`);
  }));

cafeRouter.get('/new',
  requireLogin,
  function (req, res) {
    const locals = {
      title: "New Cafe"
    };
    res.render('cafes/new', { locals });
  });

cafeRouter.get('/:id', catchAsync(async function (req, res) {
  const { id } = req.params;
  const cafe = await Cafe.findById(id).populate('author');
  cafe.myReviews = await Cafe.getReviews(cafe);
  // console.log(cafe.author._id);
  // if (req.user) console.log(req.user._id);
  res.render('cafes/details', { cafe,  user: req.user});
}));

cafeRouter.delete('/:id', 
  requireLogin,
  catchAsync(isAuthor),
  catchAsync(async function (req, res) {
    const { id } = req.params;
    const reviews = await Review.deleteMany({ myOwner: id })
    const cafe = await Cafe.findByIdAndDelete(id);
    res.redirect('/cafes');
  }));

cafeRouter.put('/:id', 
  requireLogin,
  catchAsync(isAuthor),
  catchAsync(async function (req, res) {
    const { id } = req.params;
    const { cafe } = req.body;
    CafeValidator.validate(cafe);
    const updatedCafe = await Cafe.findByIdAndUpdate(id, cafe);
    req.flash('success', 'Changes saved')
    res.redirect(`${updatedCafe._id}`);
  }));

cafeRouter.get('/:id/edit', 
  requireLogin, 
  catchAsync(isAuthor),
  catchAsync(async function (req, res) {
    const { id } = req.params;
    const cafe = await Cafe.findById(id);
    const locals = {
      title: `Edit ${cafe.name}`
    };
    res.render('cafes/edit', { locals, cafe });
  }));

cafeRouter.post('/:id/reviews', 
  requireLogin,
  catchAsync(async function (req, res) {
    const { id } = req.params;
    const { review } = req.body;
    // console.log(`Post review in cafe ${id} `)
    ReviewValidator.validate(review)
    const newReview = new Review(review);
    newReview.myOwner = mongoose.Types.ObjectId(id);
    newReview.author = req.user;
    await newReview.save();
    res.redirect(`../${id}`);
  }));

module.exports = cafeRouter;