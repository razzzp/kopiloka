const mongoose = require('mongoose');
const { Cafe } = require('../models/cafe');
const { User } = require('../models/user');


const addAuthorsToExistingCafesWithMissingUsers = async function(){
    mongoose.connect('mongodb://127.0.0.1:27017/kopiloka', { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async function () {
        console.log("Connected to the database...")
        try {
            const cafes = await Cafe.find();
            const user = await User.findOne({username:"test"});

            for(let cafe of cafes){
                cafe.populate('author');
                // if(!cafe.author){
                    cafe.author = mongoose.Types.ObjectId(user._id);
                    await cafe.save();
                    // const updatedCafe = await Cafe.findByIdAndUpdate(cafe_id, cafe)
                // }
            };
        } catch (e) {
            console.error(e);
        } finally {
            mongoose.disconnect();
        }
    });
    
};

addAuthorsToExistingCafesWithMissingUsers();