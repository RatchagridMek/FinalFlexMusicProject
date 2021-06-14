var express = require('express'),
    { ObjectID } = require('bson'),
    router = express.Router(),
    flash = require("connect-flash"),
    Addsong = require('../models/Addsong.js'),
    Signup = require('../models/Signup.js'),
    playlist = require('../models/Playlist'),
    favourite = require('../models/favourite'),
    User =  require('../models/Signup'),
    verify = require('../models/resetpassword'),
    deletereq = require('../models/RemoveUserReq'),
    multer = require('multer'),
    path = require('path'),
    middleware = require('../middleware'),
    storage = multer.diskStorage({
        destination: function(req, file, callback){
            var destPath = './public/uploads/';
            if(file.fieldname == 'spic'){
                destPath = './public/uploads/';
            } else if(file.fieldname == 'saudio'){
                destPath = './public/musicuploads/';
            } else if(file.filename == 'image'){
                destPath = './public/uploads';
            }
            callback(null, destPath);
        },
        filename: function(req, file, callback){
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    FileFilter = function (req, file, callback){
        if(file.filename === 'image'){
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                return callback(new Error('Only JPG, jpeg, PNGm and GIF image files are allowed!'), false);
            }
        }
        else if(file.filename === 'audio'){
            if(!file.originalname.match(/\.(mp3)$/i)){
                return callback(new Error('Only MP3 files are allowed!'), flase);
            }
        }
        callback(null, true);
    },
    upload  = multer({storage: storage, fileFilter: FileFilter});  
    
    

    
// method edit playlist by using playlist id
router.post('/edit/:id', upload.single('Pimage'), middleware.isLoggedIn, function(req,res){
    var Pid = req.params.id;
    var Pname = req.body.Pname;
    var Pdesc = req.body.Pdesc;
    var oldimage = req.body.oldPimage;
    if(req.file){
        req.body.image = '/uploads/' + req.file.filename;
    }
    else if(!req.file){
        req.body.image = oldimage;
    }
    var dataset = {$set:{name:Pname,description:Pdesc,Picture:req.body.image}}
    playlist.findByIdAndUpdate(Pid,dataset,function(err,getedit){
        if(err){
            console.log(err);
        }
        else if(getedit){
            res.redirect('/playlist?id='+Pid);
        }
    })
})

// method add song to playlist
router.post('/addsong', middleware.isLoggedIn, function(req,res){
    var songid = req.body.sid;
    var playlistid = req.body.pid;
    playlist.findById(playlistid,function(err,getplaylist){
        if(err){
            console.log(err);
        }
        else if(getplaylist){
            if(getplaylist.songlist.includes(songid)){
                req.flash('favinfo','Already have this song in playlist');
                var string = encodeURIComponent(songid);
                res.redirect('/song?id='+string);
            }
            else {
               getplaylist.songlist.push(songid);
                getplaylist.save();
                req.flash('success','Add to playlist Success');
                var string = encodeURIComponent(songid);
                res.redirect('/song?id='+string); 
            }
            
        }
    })
})

// method add the new playlist to database
router.post('/add', upload.single('image'), middleware.isLoggedIn, function(req,res){
    var name = req.body.pname;
    var desc = req.body.pdesc;
    if(req.file && req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
        req.body.image = '/uploads/' + req.file.filename;
    }
    else if(!req.file){
        req.body.image = '/uploads/default-playlist.jpg'
    }
    else if(req.file && !req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)){
        req.flash('error','Wrong file type');
        res.redirect('/main');
    }
    var owner = req.user.id;
    var newdata = {name:name,ownerID:owner,description:desc,Picture:req.body.image};
    playlist.create(newdata,function(err,getpass){
        if(err){
            console.log(err);
        }
            else if(getpass){
                User.findOne({_id:owner},function(err,getuser){
                    if(err){
                        console.log(err);
                    }
                    else if(getuser){
                        getuser.playlist.push(getpass);
                        getuser.save();
                        req.flash('success','Playlist has created');
                        res.redirect('/main');
                    }
                })

            }
        })
})

router.get('/', middleware.isLoggedIn, function(req,res){
    playlist.find({ownerID:req.user.id},function(err,getplaylist){
        if(err){
            console.log(err);
        }
        else if(getplaylist){
            playlist.findById(req.query.id).populate('songlist').exec(function(err,getplaylist2){
                if(err){
                    console.log(err);
                }
                else if(getplaylist2){
                    playlist.findById(req.query.id).populate({path:'songlist',options: {sort:'name'}}).exec(function(err,getnamesort){
                        if(err){
                            console.log(err);
                        }
                        else if(getnamesort){
                            playlist.findById(req.query.id).populate({path:'songlist',options: {sort:'artist'}}).exec(function(err,getartistsort){
                                if(err){
                                    console.log(err);
                                }
                                else if(getartistsort){
                                    res.render('playlist.ejs',{playlist:getplaylist,playlist2:getplaylist2,namesort:getnamesort,artistsort:getartistsort});
                                }
                            })

                        }
                    })                   
                }
            })
        }
    })
});

// method remove song from playlist 
router.get('/removesong/:sid/:pid', middleware.isLoggedIn, function(req,res){
    var sid = req.params.sid;
    var pid = req.params.pid;
    playlist.findByIdAndUpdate(pid,{$pull:{songlist:sid}},function(err,deletesong){
        if(err){
            console.log(err);
        }
        else if(deletesong){
            req.flash('success','remove from playlist');
            res.redirect('/playlist?id='+pid);
        }
    })
})

// method remove the playlist
router.get('/remove/:id', middleware.isLoggedIn, function(req,res){
    var pid = req.params.id;
    playlist.findByIdAndDelete(pid,function(err,delplaylist){
        if(err){
            console.log(err);
        }
        else if(delplaylist){
            User.findByIdAndUpdate(req.user.id,{$pull:{playlist:pid}},function(err,deluserplist){
                if(err){
                    console.log(err);
                }
                else if(deluserplist){
                    req.flash('success','Delete playlist');
                    res.redirect('/main');
                }
            })
        }
    })
})


module.exports = router;