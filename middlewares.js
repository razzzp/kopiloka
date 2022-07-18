const express = require('express');

const requireLogin = function(req, res, next){
    // console.log(req.isAuthenticated());
    // console.log(req.user);
    if(!req.isAuthenticated()){
        req.flash('error', 'Please login first');
        req.session.returnTo = req.originalUrl;
        req.session.save()
        //console.log(req.session);
        return res.redirect('/login');
    }
    next();
}

module.exports.requireLogin = requireLogin