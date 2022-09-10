const express = require('express');
const passport = require('passport');

const { catchAsync } = require('../utils/catchAsync');
const userController = require('../controllers/userController')

userRouter = express.Router();

userRouter.route('/login')
    .get(userController.renderLoginForm)
    .post(function(req, res, next){
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
        userController.loginUser);

userRouter.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsync(userController.registerNewUser));

userRouter.get('/logout', catchAsync(userController.logoutUser))

module.exports.userRouter = userRouter;