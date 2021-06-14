var express = require('express'),
    router = express.Router(),
    flash = require("connect-flash"),
    Addsong = require('../models/Addsong.js'),
    playlist = require('../models/Playlist'),
    favourite = require('../models/favourite'),
    middleware = require('../middleware');

// method fetch data from Javascript with client side
router.get('/playlistqueue/:id', middleware.isLoggedIn, function(req,res){
    var uid = req.user.id;
    playlist.findById(req.params.id).populate('songlist').exec(function(err,getsongdata){
        if(err){
            console.log(err);
        }
        else if(getsongdata){
            res.json(getsongdata.songlist);
        }
    })
});

// method fetch data from javascript with client side
router.get('/queue', middleware.isLoggedIn, function(req,res){
    var uid = req.user.id;
    favourite.find({owner:uid},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            var FavQueue = new Array(pass.length);
            pass.forEach(function(song,index){
            Addsong.findById(song.songID,function(err,getsong){
                if(err){
                    console.log(err);
                }
                else if(getsong){
                    FavQueue[index] = getsong.Audio;
                }
             })
           })
           setTimeout(function() {
            res.json(FavQueue);
        },100) 
        }
    })
});

// method fetch data from javascript with client side
router.get('/namequeue', middleware.isLoggedIn, function(req,res){
    var uid = req.user.id;
    favourite.find({owner:uid},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            var NameQueue = new Array(pass.length);
            pass.forEach(function(song,index){
            Addsong.findById(song.songID,function(err,getsong){
                if(err){
                    console.log(err);
                }
                else if(getsong){
                    NameQueue[index] = getsong.name;
                }
             })
           })
           setTimeout(function() {
            res.json(NameQueue);
        },100) 
        }
    })
})


module.exports = router;