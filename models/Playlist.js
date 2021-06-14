var mongoose = require('mongoose');
var PlaylistSchema = new mongoose.Schema({
    name:String,
    ownerID:String,
    description: String,
    Picture:String,
    songlist:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Addsong',
            required:false
        }
    ],
    Release:{
        type:Date,
        default:function(){ var currentDate = new Date();
            var createtime = new Date(currentDate.getTime()).toUTCString();
            return createtime; }
    }
});

module.exports = mongoose.model("playlist",PlaylistSchema);