var mongoose = require('mongoose');

var SongSchema = new mongoose.Schema({
    name:String,
    artist:String,
    viewer:{
        type: Number,
        default:0
    },
    Release:Date,
    Picture:String,
    Audio:String,
    Duration:String,
    Genre:String
});

module.exports = mongoose.model("Addsong",SongSchema);