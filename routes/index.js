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
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    middleware = require('../middleware');
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

router.get('/', middleware.isLoggedOut, function(req,res){
        Addsong.find({},function(err,allCollection){
            if(err){
                console.log(err);
            }
            else{
                res.render('Home.ejs',{song:allCollection});
            }
        })
});

router.get('/newrelease', middleware.isLoggedIn, function(req,res){
    var header = "New Release";
    Addsong.find({},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    }).sort({"Release":-1}); 
})

router.get('/topsong', middleware.isLoggedIn, function(req,res){
    var header = "Top song";
    Addsong.find({},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    }).sort({"viewer":-1})
})

router.get('/arcademusic', middleware.isLoggedIn, function(req,res){
    var header="Arcade Music";
    Addsong.find({Genre:"Arcade"},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    })
})

router.get('/popmusic', middleware.isLoggedIn, function(req,res){
    var header="Pop Music";
    Addsong.find({Genre:"Pop"},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    })
})

router.get('/numkala', middleware.isLoggedIn, function(req,res){
    var header="Num Kala";
    Addsong.find({artist:"NUM KALA"},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    })
})

router.get('/rockmusic', middleware.isLoggedIn, function(req,res){
    var header="Rock Music";
    Addsong.find({Genre:"Rock"},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    })
})

router.get('/acousticmusic', middleware.isLoggedIn, function(req,res){
    var header = "Acoustic Music";
    Addsong.find({Genre:"Acoustic"},function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                if(err){
                    console.log(err);
                }
                else if(getplaylist){
                    res.render('newrelease.ejs',{song:getpass,header:header,playlist:getplaylist});
                }
            })
            
        }
    })
})

router.get('/signin', middleware.isLoggedOut, function(req,res){
    res.render('Signin.ejs');
});

// -> got data for search
router.post('/search', middleware.isLoggedIn, function(req,res){
    var key = req.body.search;
    var checkspace = key.charAt(0);
    if(checkspace === " "){
        key = key.slice(1);
    }
    var string = encodeURIComponent(key);
    res.redirect("/search?key=" + string);
});

// -> edit user data from client side
router.post('/edit', middleware.isLoggedIn, upload.single('image'), function(req,res){
    var name = req.body.name;
    var id = req.body.uid;
    if(req.file){
        req.body.image = '/uploads/' + req.file.filename; 
    }
    else if(!req.file){
        req.body.image = req.user.Image;
    }
    var phone = req.body.phone;
    var email = req.body.email;
    if(req.body.email !== req.user.email){
        var dataset = {name:name,phone:phone,email:email,Image:req.body.image,username:email}
        Signup.updateOne({_id:id},dataset,function(err,pass){
            if(err){
                console.log(err);
            }
            else if(pass){
                req.flash('notlogin','You have changed email please login first');
                res.redirect('/Signin');
            }
        })
    }
    else if(req.body.email === req.user.email){
        var dataset = {name:name,phone:phone,email:email,Image:req.body.image};
        Signup.updateOne({_id:id},dataset,function(err,pass){
            if(err){
                console.log(err);
            }
            else if(pass){
                req.flash('editprofile','Edit profile successful');
                res.redirect('/profile');
            }
        })
    }
    

});

// -> page for search result
router.get('/search', middleware.isLoggedIn, function(req,res){
    var search = req.query.key;
    var value = search.toUpperCase();
    var capitalvalue = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
    Addsong.find({$or: [{"name":{ $regex: '.*' + search.toUpperCase() + '.*'}},{"artist":{$regex:'.*' + search.toUpperCase() + '.*'}},{"name":{ $regex: '.*' + search + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"name":{ $regex: '.*' + search.toLowerCase() + '.*'}},{"artist":{$regex:'.*' + search.toLowerCase() + '.*'}},{"name":{$regex: '.*'+ capitalvalue +'.*'}},{"artist":{$regex: '.*'+capitalvalue +'.*'}}]},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            Addsong.find({$or: [{"name":{ $regex: '.*' + search.toUpperCase() + '.*'}},{"name":{ $regex: '.*' + search.toLowerCase() + '.*'}},{"name":{ $regex: '.*' + search + '.*'}},{"name":{ $regex: '.*' + search + '.*'}},{"name":{$regex: '.*'+ capitalvalue +'.*'}}]},function(err,firstpass){
                if(err){
                    console.log(err);
                }
                else if(firstpass){
                    Addsong.find({$or: [{"artist":{$regex:'.*' + search.toUpperCase() + '.*'}},{"artist":{$regex:'.*' + search.toLowerCase() + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"artist":{$regex:'.*' + search + '.*'}},{"artist":{$regex: '.*'+capitalvalue +'.*'}}]},function(err,secondpass){
                        if(err){
                            console.log(err);
                        }
                        else if(secondpass){
                            playlist.find({ownerID:req.user.id},function(err,getplaylist){
                                if(err){
                                    console.log(err);
                                }
                                else if(getplaylist){
                                    res.render("search.ejs",{key:value,song:pass,namesong:firstpass,artistsong:secondpass,playlist:getplaylist});
                                }
                            })
                        }
                    }).limit(6).sort({"artist":1});
                }
            }).limit(6).sort({"name":1});
        }
    }).limit(6).sort({"viewer":-1});
})


// main page
router.get('/main', middleware.isLoggedIn, async function(req,res){
    const mostview = await Addsong.find({}).sort({"viewer":-1}).limit(5).exec();
    const newrelease = await Addsong.find({}).sort({"Release":-1}).limit(5).exec();
    const arcadesong = await Addsong.find({Genre:"Arcade"}).sort({"viewer":-1}).limit(5).exec();
    const numkala = await Addsong.find({artist:"NUM KALA"}).sort({"viewer":-1}).limit(5).exec();
    const popsong = await Addsong.find({Genre:"Pop"}).sort({"viewer":-1}).limit(5).exec();
    const rocksong = await Addsong.find({Genre:"Rock"}).sort({"viewer":-1}).limit(5).exec();
    const acousticsong = await Addsong.find({Genre:"Acoustic"}).sort({"viewer":-1}).limit(5).exec();
    const randomsong = await Addsong.aggregate([{$sample:{size:6}}]).exec();
    const userplaylist = await playlist.find({ownerID:req.user.id}).exec();
    res.render('MainPage.ejs',{
        song:mostview,
        newrelease:newrelease,
        arcade:arcadesong,
        numkala:numkala,
        pop:popsong,
        random:randomsong,
        rock:rocksong,
        playlist:userplaylist,
        guitar:acousticsong
    });

})

router.get('/Signup', middleware.isLoggedOut, function(req,res){
    Addsong.find({},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            router.render("Signup-Confirm.ejs",{test:pass});
        }
    })
});

//change the password from the client side by using old password and new password
router.post('/changepassword', middleware.isLoggedIn, function(req,res){
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var confirmnewpassword =req.body.confirmnewpassword;
    if(newpassword === confirmnewpassword){
        Signup.findOne({_id:req.user._id},function(err,User){
            if(err){
                console.log(err);
            }
            else if(User){
               User.changePassword(oldpassword, newpassword, function(err,changepass){
            if(err){
                console.log(err);
            }
            else if(changepass){
                res.redirect('/logout1');
            }
        }); 
            }
        })
    }
    else if(newpassword !== confirmnewpassword){
        res.redirect('/resetpassword');
    }
});

// method convert for Admin
router.get('/convert', middleware.isLoggedIn, function(req,res){
    if(req.user.rank === "Member"){
        res.render('wrongpath.ejs');
    }
    else if(req.user.rank === "Premium"){
        res.render('wrongpath.ejs');
    }
    else if(req.user.rank === "Admin"){
       var code = '';
        res.render('convert.ejs',{code:code}); 
    }
    
})

// method post for Admin
router.post('/convertmp3', middleware.isLoggedIn, function(req,res){
    var code = req.body.code;
    code = code.replace('https://www.youtube.com/watch?v=','');
    res.render('convert.ejs',{code:code});
})

// method profile
router.get('/Profile', middleware.isLoggedIn, function(req,res){
    res.render('Profile.ejs');
});

router.get('/premium', middleware.isLoggedIn, function(req,res){
    res.render("buypremium.ejs");
});

router.post('/premiumactive', middleware.isLoggedIn, function(req,res){
    var date = req.query.date;
    var time = 0;
    console.log(date);
    if(date === "1"){
        time = 120000;
    } else if(date === "4"){
        time = 120000;
    } else if(date === "12"){
        time = 120000;
    }
    var tempdate = new Date();
    var expdate = new Date(tempdate.getTime() + time).toUTCString();
    var dataset = {$set: {rank:"Premium",PremiumExpired:expdate}};
    Signup.updateOne({_id:req.user._id}, dataset,function(err,getpass){
        if(err){
            console.log(err);
        }
        else if(getpass){
            req.flash('info','You are now Premium');
            res.redirect('/main');
        }
    })
})


// method register
router.post('/Signup', middleware.isLoggedOut, function(req,res){
    var name = req.body.name;
    var surname = req.body.surname;
    var username = req.body.email;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;
    var samepassword = req.body.passwordcheck;
    if(password === samepassword){
        var newUser = new User({username:username,surname:surname,email:email,name:name,phone:phone});
        User.findOne({username:username},function(err,userexits){
            if(err){
                console.log(err);
            }
            else if(userexits){
                req.flash('notlogin','This email has been taken');
                res.redirect('/Signin');
            }
            else {
                User.register(newUser, password, function(err,user){
                    if(err){
                        console.log(err);
                        return res.render('Signin.ejs');
                    }
                    else if(user){
                        var rannum = cryptorandom();
                        User.updateOne({email:email},{$set:{verifyToken:rannum}},function(err,gettoken){
                            if(err){
                                console.log(err);
                            }
                            else if(gettoken){
                                verifyEmail(email,rannum);
                                req.flash('userverify','Please check your email for verify');
                                res.redirect('/Signin');
                            }
                        })
                    }
                });
            }
        })
    }
    else if(password !== samepassword){
        req.flash('error','Your password does not match');
        res.redirect('/Signin');
    }
    
});

router.get('/resetpassword', middleware.isLoggedIn, function(req,res){
    res.render('change_password.ejs');
});

router.get('/logout1', middleware.isLoggedIn, function(req,res){
    req.logout();
    req.flash('changepassword','You password has been changed');
    res.redirect('/Signin');
})

// -> logout function to delete the session and anything
router.get('/logout', middleware.isLoggedIn, function(req,res){
    req.logout();
    req.flash('logout', 'Logout success');
    res.redirect('/Signin');
});

router.get('/wrongverify', function(req,res){
    if(req.user){
        req.flash('remove','Verify wrong');
    }
    else if(!req.user){
        req.flash('notlogin','Your verify has been wrong');
        res.redirect('/Signin');
    }
    
})

router.post('/deleteuser', middleware.isLoggedIn, function(req,res){
    var email  = req.user.email;
    var random = cryptorandom();
    deletereq.create({email:email,verifyCode:random,userId:req.user.id},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            req.flash('removeuser','Please verify your email for remove the user');
            removeVerify(email,random);
            res.redirect('/main');
        }
    })
});

router.get('/deleteVerify/:token', function(req,res){
    var token = req.params.token;
    if(token === "null"){
        res.redirect('/wrongverify');
    }
    else{
            deletereq.findOne({verifyCode:token},function(err,pass){
            if(err){
                console.log(err);
            }
            else if(pass){
                var currentDate = new Date();
                var timecheck = new Date(currentDate.getTime()).toUTCString();
                console.log("Started at : "+timecheck);
                console.log("Token Invalid at : "+pass.tokenRelease);
                if(timecheck > pass.tokenRelease){
                    console.log("failed time over");
                    deletereq.updateOne({verifyCode:pass.verifyCode},{$set:{verifyCode:"null"}},function(err,gonull){
                        if(err){
                            console.log(err);
                        }
                        else if(gonull){
                            console.log("The token change to null already completed");
                            res.redirect('/wrongverify');
                        }
                    })
                }
                else if(timecheck <= pass.tokenRelease){
                    Signup.findByIdAndDelete(pass.userId,function(err,deleteuser){
                        if(err){
                            console.log(err);
                        }
                        else if(deleteuser){
                            req.flash('remove','Remove account successfullt');
                            res.redirect('/Signin');
                        }
                        else {
                            console.log("User not found");
                            req.flash('error','user not found');
                            res.redirect('/Signin');
                        }
                    })
                }
            }
            else {
                console.log('Token not found');
                res.redirect('/wrongverify');
            }
        })
    }
    
});
router.get('/song', middleware.isLoggedIn, function(req,res){
    var id = req.query.id;
    var o_id = new ObjectID(id);
    var favlist = new Array(req.user.favourites.length);
    for(let i=0;i< req.user.favourites.length;i++){
        favlist[i] = req.user.favourites[i].toString();
    }
    Addsong.find({_id:o_id},function(err,pass){
        if(err){
            console.log(err);
        }
        else if(pass){
            Addsong.find({"artist":pass[0].artist},function(err,recsong){
                if(err){
                    console.log(err);
                }
                else if(recsong){
                    Addsong.findOneAndUpdate({_id:o_id},{$inc:{"viewer":1}},function(err,viewupdate){
                        if(err){
                            console.log(err);
                        }
                        else if(viewupdate){
                            favourite.findOne({songID:id,owner:req.user.id},function(err,favour){
                                if(err){
                                    console.log(err);
                                }
                                else if(favour){
                                    playlist.find({ownerID:req.user.id},function(err,getplaylist){
                                        if(err){
                                            console.log(err);
                                        }
                                        else if(getplaylist){
                                            res.render("song.ejs",{song:pass,rec:recsong,favlist:favlist,favcheck:favour,playlist:getplaylist});
                                        }
                                    })
                                   
                                }
                                else{
                                    favour="";
                                    playlist.find({ownerID:req.user.id},function(err,getplaylist){
                                        if(err){
                                            console.log(err);
                                        }
                                        else if(getplaylist){
                                            res.render("song.ejs",{song:pass,rec:recsong,favlist:favlist,favcheck:favour,playlist:getplaylist});
                                        }
                                    })
                                   
                                }
                            })
                        }
                    });
                }
            }).limit(6);
        }
    })
});
router.get('/payment/:type', middleware.isLoggedIn, function(req,res){
    var type = req.params.type;
    var price = 0;
    var month = 0;
    if(type === "starter"){
        price = 2;
        month = 1;
    }
    else if(type === "musician"){
        price = 10;
        month = 4;
    }
    else if(type === "pro"){
        price=30;
        month=12;
    }
    res.render('confirmpayment.ejs',{price:price,month:month,type:type});
});
router.get('/payment', middleware.isLoggedIn, function(req,res){
    res.render("payment.ejs");
});

router.post('/resetpassword/:email', middleware.isLoggedOut, function(req,res){
    var email = req.params.email;
    var password = req.body.password;
    var confirmpassword = 
    Signup.findOne({email:email},function(err,user){
        if(err){
            console.log(err);
        }
        else if(user){
            user.setPassword(password,function(err,getchange){
                if(err){
                    console.log(err);
                }
                else if(getchange){
                    console.log("Change password complete");
                    user.save(function(err,noerr){
                        if(err){
                            console.log(err);
                        }
                        else if(noerr){
                            res.redirect('/signin');
                        }
                    })
                }
            })
        }
    })
});
router.get('/userverify/:token', middleware.isLoggedOut, function(req,res){
    var string = req.params.token;
    if(string === "null"){
        res.redirect('/wrongverify');
    }
    else{
        User.findOne({verifyToken:string},function(err,pass){
            if(err){
                console.log(err);
                res.redirect('/wrongverify');
            }
            else if(pass){
                User.updateOne({verifyToken:pass.verifyToken},{$set:{Userverify:true,verifyToken:"null"}},function(err,gonull){
                    if(err){
                        console.log(err);
                    }
                    else if(gonull){
                       req.flash('remove','You email has been verify');
                       res.redirect('/Signin');  
                    }
                   
                })
            }
            else if(!pass){
                res.redirect('/wrongverify');
            }
        })
    }
});


function sendEmail(email,uniqueString){
    var user = "";
    var password = "";
    var Transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:user,
            pass:password
        }
    });
    console.log(uniqueString);
    const link = "http://localhost:3000/verify?token="+uniqueString;
    var mailOptions;
    let sender = "FLEX MUSIC DEVELOPMENT";
    mailOptions = {
        from: sender,
        to: email,
        subject: "The Verification for reset password",
        text:"Request reset password",
        html:"<div style='text-align:center; margin-top: 5%; height:775px; background-color: rgb(221, 211, 211);'><a style='font-size: 350%; color:rgb(0, 0, 0)'>FLEX</a><br><hr style='width:40%; margin-left: 30%; border: 2px solid #f22c2c;'><br><div style='margin-left: 30%; background-color: rgb(255, 255, 255); width: 40%; height: 600px;'><div style='font-size: 215%; color:rgb(19, 119, 211); margin-top: 0%; margin-left: 5%;'><br><b>Dear customer</b></div><div style='font-size: 180%; color:rgb(0, 0, 0); margin-top: 3%;'>please click on the button below to reset your password<br> Once you have done. please try re-logging <br></div><br><br><form action="+link+" target='_blank'><button title='Click to verify' style='cursor: pointer; font-size: 150%; margin-left: 4%; border: 2px solid rgb(248, 2, 2); color: rgb(0, 0, 0); padding: 1% 6% 1% 6%;' type='submit'>Verify email</button></form><br><br><br><div style='font-size: 180%; color:rgb(0, 0, 0); '>if you have any issues. feel free to reach us at<br>flexmusicmek@gmail.com<br><br>Best regards,<br>Flex Developers.</div></div></div>"
    };

    Transport.sendMail(mailOptions, function(err, response){
        if(err){
            console.log(err);
        }
        else if(response){
            console.log(link);
            console.log("Message has been sent");
        }
    })
}

function verifyEmail(email,uniqueString){
    var user = "";
    var password = "";
    var Transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:user,
            pass:password
        }
    });
    console.log(uniqueString);
    const link = "http://localhost:3000/userverify/"+uniqueString;
    var mailOptions;
    let sender = "FLEX MUSIC DEVELOPMENT";
    mailOptions = {
        from: sender,
        to: email,
        subject: "Email verification",
        text:"Request reset password",
        html:"<div style='text-align:center; margin-top: 5%; height:775px; background-color: rgb(221, 211, 211);'><a style='font-size: 350%; color:rgb(0, 0, 0)'>FLEX</a><br><hr style='width:40%; margin-left: 30%; border: 2px solid #f22c2c;'><br><div style='margin-left: 30%; background-color: rgb(255, 255, 255); width: 40%; height: 600px;'><div style='font-size: 215%; color:rgb(19, 119, 211); margin-top: 0%; margin-left: 5%;'><br><b>Dear customer</b></div><div style='font-size: 180%; color:rgb(0, 0, 0); margin-top: 3%;'>Please click on the button below to verify this email<br> Once you have done. You will be allowed to continue login to website <br></div><br><br><form action="+link+" target='_blank'><button title='Click to verify' style='cursor: pointer; font-size: 150%; margin-left: 4%; border: 2px solid rgb(248, 2, 2); color: rgb(0, 0, 0); padding: 1% 6% 1% 6%;' type='submit'>Verify email</button></form><br><br><br><div style='font-size: 180%; color:rgb(0, 0, 0); '>if you have any issues. feel free to reach us at<br>flexmusicmek@gmail.com<br><br>Best regards,<br>Flex Developers.</div></div></div>"
    };

    Transport.sendMail(mailOptions, function(err, response){
        if(err){
            console.log(err);
        }
        else if(response){
            console.log(link);
            console.log("Message has been sent");
        }
    })
}

function removeVerify(email,uniqueString){
    var user = "";
    var password = "";
    var Transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:user,
            pass:password
        }
    });
    console.log(uniqueString);
    const link = "http://localhost:3000/deleteVerify/"+uniqueString;
    var mailOptions;
    let sender = "FLEX MUSIC DEVELOPMENT";
    mailOptions = {
        from: sender,
        to: email,
        subject: "Email verification",
        text:"Request reset password",
        html:"<div style='text-align:center; margin-top: 5%; height:850px; background-color: rgb(221, 211, 211);'><a style='font-size: 350%; color:rgb(0, 0, 0)'>FLEX</a><br><hr style='width:50%; margin-left: 24%; border: 2px solid #f22c2c;'><br><div style='margin-left: 24%; background-color: rgb(255, 255, 255); width: 50%; height: 720px;'><div style='font-size: 215%; color:rgb(19, 119, 211); margin-top: 0%; margin-left: 5%;'><br><b>Dear customer</b></div><div style='font-size: 180%; color:rgb(0, 0, 0); margin-top: 3%;'>We heard that you have request to delete your account,<br> So we decided to send you another verification email<br> for security. If it were you please click on the button below to continue the step but if it's not you feel free to enjoy the website<br>we're not currently delete your account<br></div><br><br><form action="+link+" target='_blank'><button title='Click to verify' style='cursor: pointer; font-size: 150%; margin-left: 4%; border: 2px solid rgb(248, 2, 2); color: rgb(0, 0, 0); padding: 1% 6% 1% 6%;' type='submit'>Continue</button></form><br><br><br><div style='font-size: 180%; color:rgb(0, 0, 0); '>This like will expired in 5 minute, <br>If you have any issues. feel free to reach us at<br>flexmusicmek@gmail.com<br><br>Best regards,<br>Flex Developers.</div></div></div>"
    };

    Transport.sendMail(mailOptions, function(err, response){
        if(err){
            console.log(err);
        }
        else if(response){
            console.log(link);
            console.log("Message has been sent");
        }
    })
}


// using crypto special random module
function cryptorandom(){
    var id = crypto.randomBytes(20).toString('hex');
    return id;
}

module.exports = router;
