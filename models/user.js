const mongoose = require('mongoose');
const crypto = require('node:crypto');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
});

// /**
//  * NOT USED, currently using passport-local-mongoose
//  * Plugin to add authentication methods and fields to a mongoose Schema
//  * @param {mongoose.Schema} schema 
//  * @param {*} options 
//  */
// const authenticationPlugin = function(schema, options){
//     schema.add({
//         salt:{
//             type: String,
//             required: true,
//         },
//         hashedPassword:{
//             type: String,
//             required: true,
//         }
//     })
//     /**
//      * Takes new user Document, gets salt and calculates hash
//      *  before storing in the DB
//      * @param {mongoose.Document} user 
//      * @param {string} password 
//      */
//     schema.statics.register = async function(user, password){
//         user.salt = crypto.randomBytes(32).toString();
        
//         crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//             if (err) {
//                 return null;
//             } 
//             user.hashedPassword = hashedPassword;
//             user.save();
//             return user;
//         });
//         return null;
//     }

//     /**
//      * Verifies if the username and password are correct
//      *  calls done after wards
//      * @param {string} username 
//      * @param {string} password 
//      * @param {Function} done 
//      */
//     schema.statics.verify = async function(username, password, cb){
//         user = await this.findOne({username : username})
//         if (!user){ return cb(null, false, { message: 'Incorrect username or password.' }); }

//         crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//             if (err) {return cb(err)} 
//             if (!crypto.timingSafeEqual(user.hashedPassword, hashedPassword)) {
//                 return cb(null, false, { message: 'Incorrect username or password.' });
//             }
//             return cb(null, user);
//         });
//     }
// }

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User',userSchema,'users');
module.exports = {User};