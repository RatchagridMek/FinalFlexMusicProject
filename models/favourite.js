var mongoose = require('mongoose');

var favouriteSchema = new mongoose.Schema({
    owner:String,
    ownername:String,
    name:String,
    artist:String,
    songID:String,
    release:String,
    duration:String
});

module.exports = mongoose.model("favourite",favouriteSchema);