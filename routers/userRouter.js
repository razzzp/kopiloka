const { application } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { User }  = require('../models/user')
const { catchAsync } = require('../utils/catchAsync');

userRouter = express.Router();

userRouter.get('/login', function(req, res){
    // req.session.returnTo = req.session.returnTo;
    console.log(req.session);
    res.render('user/login');
});

userRouter.post('/login', 
    function(req, res, next){
        // middleware to save returnTo to req object,
        //  because passport.authenticate clears session
        //  data
        req.returnTo = req.session.returnTo;
        next();
    },
    passport.authenticate('local', {
        failureFlash : 'Incorrect username or password',
        failureRedirect: '/login'
    }),
    function(req, res){
        console.log(req.session)
        const redirectTo = req.returnTo || '/cafes';
        req.flash('success', 'Welcome back');

        delete req.session.returnTo;
        req.session.save();

        res.redirect(redirectTo);     
    });

userRouter.get('/register', function(req, res){
    res.render('user/register');
});

userRouter.post('/register', 
    catchAsync(async function(req, res, next){
        try{
            const { username, email, password } = req.body;
            const newUser = new User({
                email : email,
                username : username,
            });
            console.log('registering user...')
            registeredUser = await User.register(newUser, password);
            console.log('user registered.');
            req.login(registeredUser, function(err){
                if(err)return next(err)
                else {
                    req.flash('success', 'Welcome ' + username);
                    res.redirect('/');
                }
            });        
        } catch (e) {
            console.log('error while user register!');
            req.flash('error', 'Failed to register: ' + e.message);
            res.redirect('/register');
        }
    })
);

userRouter.get('/logout', 
    catchAsync(async function(req, res, next){
        req.logout(
            function(err){
                if(err){
                    next(err);
                } else {
                    req.flash('success', 'You have been logged out');
                    res.redirect('/');
                }
            }
        );
    })
)


module.exports.userRouter = userRouter;