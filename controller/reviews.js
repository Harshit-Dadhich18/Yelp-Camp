const campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    const Campground = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
    req.flash('success','Successfully created new review');
    res.redirect(`/campground/${Campground._id}`);
}

module.exports.deleteReview = async(req,res)=>{
    const {id,reviewID} = req.params;
    await campground.findByIdAndUpdate(id,{$pull:{reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success','Successfully Deleted review');
    res.redirect(`/campground/${id}`);
}