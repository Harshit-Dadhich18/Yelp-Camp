const express = require('express');
const router = express.Router({mergeParams:true});
const campground = require('../models/campground');
const {validateReview, isloggedIn, isReviewAuthor} = require('../middleware');
const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const Reviews = require('../controller/reviews');

router.post('/',isloggedIn ,validateReview, catchAsync(Reviews.createReview));

router.delete('/:reviewID', isloggedIn,isReviewAuthor, catchAsync(Reviews.deleteReview));

module.exports = router;