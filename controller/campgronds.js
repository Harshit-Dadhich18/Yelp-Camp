const { geocoding } = require('@maptiler/client');
const campground = require('../models/campground');
const cloudinary = require('cloudinary').v2;
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req,res)=>{
    const campgrounds =  await campground.find({});
    res.render('campgrounds/index',{ campgrounds });
}

module.exports.renderNewForm =  (req,res)=>{
    res.render('campgrounds/create');
}

module.exports.createCampground = async (req,res,next )=>{
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const camp = new campground(req.body.campground);
    camp.geometry = geoData.features[0].geometry;
    camp.images = req.files.map(f =>  ({url: f.path, filename: f.filename}))
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success','Successfully created new Campground');
    res.redirect(`campground/${camp._id}`);
    
}

module.exports.showCampground = async (req,res)=>{
    const camp =  await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Could not find campground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/show',{ camp });
}

module.exports.renderEditForm = async (req,res,next)=>{
    const { id } = req.params;
    const camp =  await campground.findById(id);
    if(!camp){
        req.flash('error', 'Could not find campground');
        return res.redirect('/campground');
    }
    res.render('campgrounds/edit',{ camp });
}

module.exports.updateCampground = async (req,res)=>{
    const { id }= req.params;
    const camp = await campground.findByIdAndUpdate(id,{...req.body.campground});
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f =>  ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
        console.log(camp);
    }
    req.flash('success','Successfully Updated Campground');
    res.redirect(`/campground/${camp._id}`);
}

module.exports.deleteCampground = async (req,res)=>{
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Campground');
    res.redirect('/campground')
}