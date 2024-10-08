const campground = require('./models/campground');
const ExpressError = require('./utils/expressError');
const {CampgroundSchema, ReviewSchema}  = require('./schemas');
const Review = require('./models/review');

module.exports.isloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be signed in first!!');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.isAuthor = async (req,res,next)=>{
    const { id } = req.params;
    const camp = await campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campground/${id}`);
    }
    next();
}
module.exports.validateCampground = (req,res,next) =>{
    const { error } = CampgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    const { error } = ReviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const { id, reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campground/${id}`);
    }
    next();
}