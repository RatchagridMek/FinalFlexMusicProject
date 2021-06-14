var mongoose = require('mongoose');

var confirmSchema = new mongoose.Schema({
    email:String,
    verifyCode:String,
    userId:String,
    tokenRelease:{
        type:String,
        default: function(){ 
            var currentDate = new Date();
            var timecheck = new Date(currentDate.getTime()+ 5 * 60000).toUTCString();
            return timecheck;
        },
        require: true
    }
});

module.exports = mongoose.model("removeRequest",confirmSchema);