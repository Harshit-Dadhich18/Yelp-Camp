const User = require('../models/user.js');

module.exports.renderRegister = (req,res)=>{
    res.render('user/register');
}

module.exports.register = async (req,res,next)=>{
    try{
    const {username, email, password} = req.body;
    const user = await new User({username,email});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err) return next(err);
        else{
            req.flash('success','Successfully!! Registered');
            return res.redirect('/campground');
        }
    })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req,res)=>{
    res.render('user/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campground'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logout( function(err){
        if(err){
        return next(err)}
        req.flash('success','Goodbye');
        res.redirect('/campground');
    });
}