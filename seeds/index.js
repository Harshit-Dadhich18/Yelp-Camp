const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');
const campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp1',
    { }).then(()=>{
    console.log("Connected to Mongoose");
})
.catch(e=>{
    console.log('Oh No Erro!!');
    console.log(e);
})
const sample = array => array[Math.floor(Math.random()*array.length)];
const seedDB = async()=>{
    await campground.deleteMany({});
    
    for(let i = 0;i<300;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
        // your user id
        author: '66a0daa15009290fe556b7fd',
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title:`${sample(descriptors)} ${sample(places)}`,
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit facilis ipsa a quisquam esse, laudantium quibusdam excepturi. Ab at culpa molestiae harum delectus ratione libero sunt laborum fugiat, quae modi',
        price ,
        geometry: {
            type: 'Point',
            coordinates: [cities[random1000].longitude,
                        cities[random1000].latitude]
        },
        images: [{
            url: 'https://res.cloudinary.com/dvl3owmkt/image/upload/v1724291676/YelpCamp/b972l65nzvrtgfm5xgit.jpg',
            filename: 'YelpCamp/b972l65nzvrtgfm5xgit',
        },
        {
            url: 'https://res.cloudinary.com/dvl3owmkt/image/upload/v1724291676/YelpCamp/lrx5xl93kcn8osvss5f2.jpg',
            filename: 'YelpCamp/lrx5xl93kcn8osvss5f2'
        },
        {
            url: 'https://res.cloudinary.com/dvl3owmkt/image/upload/v1724291681/YelpCamp/cwwbwc9iuba0dwvjxlxa.jpg',
            filename: 'YelpCamp/cwwbwc9iuba0dwvjxlxa'
        }
        ]
    });
    await camp.save();}
}
seedDB();