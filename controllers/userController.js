const { User }  = require('../models/user')

const renderLoginForm = function(req, res){
    // req.session.returnTo = req.session.returnTo;
    // console.log(req.session);
    res.render('user/login');
}

const loginUser = function(req, res){
    // console.log(req.session)
    const redirectTo = req.returnTo || '/cafes';
    req.flash('success', 'Welcome back ' + req.user.username);

    delete req.session.returnTo;
    req.session.save();

    res.redirect(redirectTo);     
}

const renderRegisterForm = function(req, res){
    res.render('user/register');
}

const registerNewUser = async function(req, res, next){
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
}

const logoutUser = async function(req, res, next){
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
}

module.exports = {
    renderLoginForm,
    loginUser,
    renderRegisterForm,
    registerNewUser,
    logoutUser,
}