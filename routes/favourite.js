var express = require('express'),
    flash = require("connect-flash"),
    { ObjectID } = require('bson'),
    router = express.Router(),
    Addsong = require('../models/Addsong.js'),
    Signup = require('../models/Signup.js'),
    playlist = require('../models/Playlist'),
    favourite = require('../models/favourite'),
    User =  require('../models/Signup'),
    verify = require('../models/resetpassword'),
    deletereq = require('../models/RemoveUserReq'),
    middleware = require('../middleware');

router.get('/', middleware.isLoggedIn,function(req,res){
        var uid = req.user.id;
        favourite.find({owner:uid},function(err,pass){
            if(err){
                console.log(err);
            }
            else if(pass){
                favourite.find({owner:uid}, function(err,namesort){
                    if(err){
                        console.log(err);
                    }
                    else if(namesort){
                        favourite.find({owner:uid},function(err,artistsort){
                            if(err){
                                console.log(err);
                            }
                            else if(artistsort){
                                    playlist.find({ownerID:req.user.id},function(err,getplaylist){
                                        if(err){
                                            console.log(err);
                                        }
                                        else if(getplaylist){
                                            res.render('favourite.ejs',{song:pass,namesort:namesort,artistsort:artistsort,playlist:getplaylist});
                                        }
                                    })
                            }
                        }).sort({"artist":1});
                    }
                }).sort({"name":1});
            }
        })
});


// method to remove song from favourite
router.get('/remove/:id', middleware.isLoggedIn, function(req,res){
    var sid = req.params.id;
    var o_id = new ObjectID(sid);
    User.findByIdAndUpdate(req.user.id,{$pull:{favourites:sid}},function(err,getuser){
        if(err){
            console.log(err);
        }
        else if(getuser){
            favourite.deleteOne({_id:o_id},function(err,pass){
                if(err){
                    console.log(err);
                }
                else if(pass){
                    req.flash('favinfo','Remove from favourite');
                    res.redirect('/favourite');
                }
            })
        }
    })
});

router.get('/remove/:id/:sid', middleware.isLoggedIn, function(req,res){
    var favid = req.params.id;
    var sid = req.params.sid;
    var userid = req.user.id;
    var o_id = new ObjectID(favid);
    User.findByIdAndUpdate(req.user.id,{$pull: {favourites:favid}},function(err,getuser){
            if(err){
                console.log(err);
            }
            else if(getuser){
                favourite.deleteOne({_id:o_id},function(err,pass){
                    if(err){
                        console.log(err);
                    }
                    else if(pass){
                        req.flash('favinfo','Remove from favourite');
                        res.redirect('/song?id='+sid);
                    }
                })    
            }
    })
});

// method add song to favourite
router.post('/add/:id', middleware.isLoggedIn, function(req,res){
    var sid = req.params.id;
    var o_sid = new ObjectID(sid)
    var username = req.body.uname;
    var uid = req.body.uid;
    var o_uid = new ObjectID(uid)
    User.findOne({_id:o_uid},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            Addsong.find({_id:o_sid},function(err,getpass){
                if(err){
                    console.log(err);
                }
                else if(getpass){
                    newdata = {owner:uid, ownername:username, name:getpass[0].name, artist:getpass[0].artist, songID:sid, release:getpass[0].Release,duration:getpass[0].Duration}
                    favourite.create(newdata,function(err,newCreate){
                        if(err){
                            console.log(err);
                        }
                        else if(newCreate){
                            pass.favourites.push(newCreate);
                            pass.save();
                            req.flash('favinfo','Add song to favourite');
                            var string = encodeURIComponent(sid);
                            res.redirect('/song?id='+string);
                        }
                    })
                }
            })
        }
    })

})




module.exports = router;