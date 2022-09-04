const express = require('express');
const { Cafe } = require('./models/cafe');
const { Review } = require('./models/review');

const requireLogin = function(req, res, next){
    // console.log(req.isAuthenticated());
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash('error', 'Please login first');
        req.session.returnTo = req.originalUrl;
        req.session.save()
        //console.log(req.session);
        return res.redirect('/login');
    } else {
        next();    
    }
}

const isAuthor = async function(req, res, next){
    const { id } = req.params;
    const cafe = await Cafe.findById(id).populate('author');
    if(cafe && !cafe.author.equals(req.user)){
        req.flash('error', 'You are not authorized to do that.');
        res.redirect(`/cafes/${id}`);
    } else{
        next();
    }
}

const isReviewAuthor = async function(req, res, next){
    const { reviewId } = req.params;
    const { fromCafeId } = req.query;
    const review = await Review.findById(reviewId).populate('author');
    if(review && !review.author.equals(req.user)){
        req.flash('error', 'You are not authorized to do that.');
        res.redirect(`/cafes/${fromCafeId}`);
    } else{
        next();
    }
}

module.exports = {requireLogin,isAuthor,isReviewAuthor};