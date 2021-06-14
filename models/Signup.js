var mongoose = require('mongoose');
var passportlocalMongoose = require('passport-local-mongoose');

var SignupSchema = new mongoose.Schema({
    username:String,
    name: String,
    surname: String,
    email: String,
    password: String,
    phone: String,
    PremiumExpired:{
        type:String,
        require: false
    },
    Userverify:{
        type:Boolean,
        default:false
    },
    verifyToken:{
        type:String,
    },
    rank:{
        type:String,
        default:"Member"
    },
    favourites:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'favourite'
        }
    ],
    playlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ],
    Image:{
        type:String,
        default:"/uploads/default.jpg"
    }
});

SignupSchema.plugin(passportlocalMongoose);
module.exports = mongoose.model('signups', SignupSchema);