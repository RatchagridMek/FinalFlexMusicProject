var express = require('express'),   
    { ObjectID } = require('bson');
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


    //remove song from database
router.get('/remove/:id', middleware.isLoggedIn, async function(req,res){
    const deletedSong = await Addsong.findById(req.params.id).exec();
    await Addsong.findByIdAndRemove(req.params.id).exec();
    const findFavid = await favourite.find({songID:req.params.id}).exec();
    await favourite.deleteMany({songID:req.params.id}).exec();
    await playlist.updateMany({}, {$pull: {songlist: deletedSong._id}}).exec();
    await findFavid.forEach(async function(favid){
        await User.updateMany({}, {$pull: {favourites: favid.id}}).exec();
    })
    res.redirect('/SongM');
});

// edit song from database
router.post('/edit/:id', middleware.isLoggedIn, upload.any([{name: 'spic'}, {name: 'saudio'}]), function(req,res){
    var uid = req.params.id;
    var o_id = new ObjectID(uid);
    var sname = req.body.sname;
    var sartist = req.body.sartist;
    var oldaudio = req.body.Audioold;
    var oldImage = req.body.Imageold;
    if(req.files[0] && req.files[0].originalname.match(/\.(jpg|jpeg|png|gif)$/i) && req.files[1]){
        req.body.spic = '/uploads/' + req.files[0].filename;
        console.log('have pic && audio');
    }
    else if(!req.files[0]){
        console.log('dont have pic && audio');
        req.body.spic = oldImage;
        req.body.saudio = oldaudio;
    }
    else if(req.files[0] && req.files[0].originalname.match(/\.(jpg|jpeg|png|gif)$/i) && !req.files[1]){
        req.body.spic = '/uploads/' + req.files[0].filename;
        req.body.saudio = oldaudio;
        console.log('have only pic'); 
    }
    if(req.files[0] && req.files[0].originalname.match(/\.(mp3)$/i)){
        req.body.saudio = '/musicuploads/' + req.files[0].filename;
        req.body.spic = oldImage;
        console.log('have only audio')
    }
    if(req.files[1]){
        req.body.saudio = '/musicuploads/' + req.files[1].filename;
    }
    var srelease = req.body.srelease;
    var sduration = req.body.sduration;
    var dataset = { $set: {name:sname,artist:sartist,release:srelease,Picture:req.body.spic,Duration:sduration,Audio:req.body.saudio}};
    Addsong.updateOne({_id:o_id}, dataset, function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            req.flash('success','Edit successful');
            res.redirect('/songM');
        }
    });

});


router.get('/edit/:id', middleware.isLoggedIn, function(req,res){
    var uid = req.params.id;
    var o_id = new ObjectID(uid);
    Addsong.findOne({_id:o_id},function(err,result){
        if(err){
            console.log(err);
        }
        else if(result){
            req.flash('success', 'Update successful');
            res.render('editsong.ejs',{song:result});
        }
    })

});

//search method
router.post('/search', middleware.isLoggedIn, function(req,res){
    var search = req.body.search;
    var BigSearch = req.body.search.toUpperCase();
    var LowSearch = req.body.search.toLowerCase();
    var capitalvalue = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
    Addsong.find({$or: [{"name":{ $regex: '.*' + search + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"name":{ $regex: '.*' + BigSearch + '.*'}},{"artist":{$regex:'.*' + BigSearch + '.*'}},{"name":{ $regex: '.*' + LowSearch + '.*'}},{"artist":{$regex:'.*' + LowSearch + '.*'}},{"name":{ $regex: '.*' + capitalvalue + '.*'}},{"artist":{$regex:'.*' + capitalvalue + '.*'}}]},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            Addsong.find({$or: [{"name":{ $regex: '.*' + search + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"name":{ $regex: '.*' + BigSearch + '.*'}},{"artist":{$regex:'.*' + BigSearch + '.*'}},{"name":{ $regex: '.*' + LowSearch + '.*'}},{"artist":{$regex:'.*' + LowSearch + '.*'}},{"name":{ $regex: '.*' + capitalvalue + '.*'}},{"artist":{$regex:'.*' + capitalvalue + '.*'}}]},function(err,namesort){
                if(err){
                    console.log(err);
                }
                else if(namesort){
                    Addsong.find({$or: [{"name":{ $regex: '.*' + search + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"name":{ $regex: '.*' + BigSearch + '.*'}},{"artist":{$regex:'.*' + BigSearch + '.*'}},{"name":{ $regex: '.*' + LowSearch + '.*'}},{"artist":{$regex:'.*' + LowSearch + '.*'}},{"name":{ $regex: '.*' + capitalvalue + '.*'}},{"artist":{$regex:'.*' + capitalvalue + '.*'}}]},function(err,artistsort){
                        if(err){
                            console.log(err);
                        }
                        else if(artistsort){
                                Addsong.find({$or: [{"name":{ $regex: '.*' + search + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"name":{ $regex: '.*' + BigSearch + '.*'}},{"artist":{$regex:'.*' + BigSearch + '.*'}},{"name":{ $regex: '.*' + LowSearch + '.*'}},{"artist":{$regex:'.*' + LowSearch + '.*'}},{"name":{ $regex: '.*' + capitalvalue + '.*'}},{"artist":{$regex:'.*' + capitalvalue + '.*'}}]},function(err,viewsort){
                                    if(err){
                                        console.log(err);
                                    }
                                    else if(viewsort){
                                        Addsong.find({},function(err,author){
                                            if(err){
                                                console.log(err);
                                            }
                                            else if(author){
                                                res.render("songM.ejs",{song:pass,name:namesort,artist:artistsort,view:viewsort,artistforinput:author});
                                            }
                                        }).distinct("artist");
                                    }
                                }).sort({"viewer":1})
                        }
                    }).sort({"artist":1})
                }
            }).sort({"name":1})
        }
    })
});

router.get('/', middleware.isLoggedIn, function(req,res){
    if(req.user.rank === "Member"){
        res.redirect('/What_do_you_want_to_do');
    }
    else if(req.user.rank === "Admin"){
        Addsong.find({},function(err,allCollection){
            if(err){
                console.log(err);
            }
            else {
                Addsong.find({},function(err,namesort){
                    if(err){
                        console.log(err);
                    }
                    else if(namesort){
                        Addsong.find({},function(err,artistsort){
                            if(err){
                                console.log(err);
                            }
                            else if(artistsort){
                                Addsong.find({},function(err,viewsort){
                                    if(err){
                                        console.log(err);
                                    }
                                    else if(viewsort){
                                        Addsong.find({},function(err,author){
                                            if(err){
                                                console.log(err);
                                            }
                                            else if(author){
                                                res.render("songM.ejs",{song:allCollection,name:namesort,artist:artistsort,view:viewsort,artistforinput:author});
                                            }
                                        }).distinct("artist");
                                    }
                                }).sort({"viewer":-1})
                                
                            }
                        }).sort({"artist":1})
                    }
                }).sort({"name":1})
            }
        })
    }
    else{
        res.redirect('/What_do_you_want_to_do');
    }
});


// method add song to database
router.post('/add', middleware.isLoggedIn, upload.any([{name: 'spic'}, {name: 'saudio'}]), function(req,res){
    var name = req.body.sname;
    var author = req.body.sauthor;
    var time = req.body.stime;
    req.body.spic = '/uploads/' + req.files[0].filename;
    req.body.saudio = '/musicuploads/' + req.files[1].filename;
    var date = new Date(time).toDateString();
    var duration = req.body.sduration;
    var sgenre = req.body.sgen;
    var newsong = {name:name,artist:author,Release:date,Picture:req.body.spic,Duration:duration,Genre:sgenre,Audio:req.body.saudio};
    Addsong.create(newsong,function(err,newlyCreated){
        if(err){
            console.log(err);
        }
        else if(newlyCreated){ 
           req.flash('success',"Song has been add"); 
           res.redirect('/songM');
        }
    })
});


module.exports = router;