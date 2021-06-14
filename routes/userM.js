var express = require('express'),
    router = express.Router(),
    { ObjectID } = require('bson'),
    flash = require("connect-flash"),
    Addsong = require('../models/Addsong.js'),
    Signup = require('../models/Signup.js'),
    playlist = require('../models/Playlist'),
    favourite = require('../models/favourite'),
    User =  require('../models/Signup'),
    verify = require('../models/resetpassword'),
    deletereq = require('../models/RemoveUserReq'),
    middleware = require('../middleware');

// method remove user
router.get('/remove/:id', middleware.isLoggedIn, function(req,res){
        var ida = req.params.id;
        var o_id = new ObjectID(ida);
        Signup.deleteOne({_id:o_id},function(err,result){
            if(err){
                console.log(err);
            }
            else if(result){
                req.flash('success', "Delete successfully");
                res.redirect('/userM');
            }
        })
});    

//method get edit user
router.get('/edit/:id', middleware.isLoggedIn, function(req,res){
    var ida = req.params.id;
    var o_id = new ObjectID(ida);
    Signup.findOne({_id:o_id},function(err,result){
        if(err){
            console.log(err);
        }
        else if(result){ 
            res.render('edituser.ejs',{user:result});
        }
    })
});

//method post edit user
router.post('/edit/:id', middleware.isLoggedIn, function(req,res){
    var uid = req.params.id;
    var o_id = new ObjectID(uid);
    var uname = req.body.uname;
    var usurname = req.body.usurname;
    var uemail = req.body.uemail;
    var uphone = req.body.uphone;
    var urank = req.body.urank;
    var dataset = { $set: {name:uname,surname:usurname,email:uemail,phone:uphone,rank:urank} };
    Signup.updateOne({_id:o_id}, dataset, function(err,edit){
        if(err){
            console.log(err);
        }
        else if(edit){
            console.log("Complete edit");
            req.flash('success', "Edit user successfully");
            res.redirect('/userM');
        }
    });
});


// search method
router.post('/search', middleware.isLoggedIn, function(req,res){
    var search = req.body.search;
    Signup.find({"name":{ $regex: '.*' + search + '.*'}},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            Signup.find({"name":{ $regex: '.*' + search + '.*'}},function(err,namesort){
                if(err){
                    console.log(err);
                }
                else if(namesort){
                    Signup.find({"name":{ $regex: '.*' + search + '.*'}},function(err,surnamesort){
                        if(err){
                            console.log(err);
                        }
                        else if(surnamesort){
                            Signup.find({"name":{ $regex: '.*' + search + '.*'}},function(err,emailsort){
                                if(err){
                                    console.log(err);
                                }
                                else if(emailsort){
                                    Signup.find({"name":{ $regex: '.*' + search + '.*'}},function(err,ranksort){
                                        if(err){
                                            console.log(err);
                                        }
                                            else if(ranksort){
                                                res.render("userM.ejs",{user:pass,name:namesort,surname:surnamesort,email:emailsort,rank:ranksort});
                                            }
                                    }).sort({"rank":1});
                                }
                            }).sort({"email":1});
                        }
                    }).sort({"surname":1})
                }
            }).sort({"name":1});
        }
    })
});

router.get('/', middleware.isLoggedIn, function(req,res){
    if(req.user.rank === "Member"){
        res.redirect('/what_do_you_want_to_do');
    }
    else if(req.user.rank === "Admin"){
        Signup.find({},function(err,allCollection){
            if(err){
                console.log(err);
            }
            else{
                Signup.find({},function(err,namesort){
                    if(err){
                        console.log(err);
                    }
                    else if(namesort){
                        Signup.find({},function(err,surnamesort){
                            if(err){
                                console.log(err);
                            }
                            else if(surnamesort){
                                Signup.find({},function(err,emailsort){
                                    if(err){
                                        console.log(err);
                                    }
                                    else if(emailsort){
                                        Signup.find({},function(err,ranksort){
                                            if(err){
                                                console.log(err);
                                            }
                                                else if(ranksort){
                                                    res.render("userM.ejs",{user:allCollection,name:namesort,surname:surnamesort,email:emailsort,rank:ranksort});
                                                }
                                        }).sort({"rank":1});
                                    }
                                }).sort({"email":1});
                            }
                        }).sort({"surname":1})
                    }
                }).sort({"name":1});
            }
        })
    }
    else{
        res.redirect('/what_do_you_want_to_do');
    }
});


module.exports = router;
