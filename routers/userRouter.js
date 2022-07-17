const express = require('express');
const mongoose = require('mongoose');
const { User }  = require('../models/user')
const { catchAsync } = require('../utils/catchAsync');

userRouter = express.Router();

userRouter.get('/login', function(req, res){
    // TODO
    res.send('TODO :)')
});

userRouter.post('/login', function(req, res){
    // TODO
    res.send('TODO :)')
});

userRouter.get('/register', function(req, res){
    res.render('user/register');
});

userRouter.post('/register', catchAsync(async function(req, res, next){
    const { user } = req.body;
    const newUser = new User({
        username : user.username,
        email : user.email,
    });

    User.register(newUser, user.password, function(err, account){
        console.log('registering user...')
        if(err){
            console.log('error while user register!', err);
            return next(err);
        }

        console.log('user registered.');
        res.redirect('/');
    });
}));


module.exports.userRouter = userRouter;