const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// const campground = require('../models/campground');
const {isloggedIn, isAuthor, validateCampground} = require('../middleware');
const campgrounds = require('../controller/campgronds');
const multer  = require('multer')
const { storage} = require('../Cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isloggedIn, upload.array('image'), validateCampground , catchAsync(campgrounds.createCampground));

router.get('/new',isloggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isloggedIn,isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isloggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));

    router.get('/:id/edit',isloggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;
