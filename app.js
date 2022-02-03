
const { ObjectID } = require('bson');
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = 3000,
    mongoose = require('mongoose'),
    ObjectId = require('mongoose').ObjectId,
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    flash = require("connect-flash"),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    multer = require('multer'),
    path = require('path');

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());
mongoose.connect('mongodb://localhost/SongProject');

var Addsong = require('./models/Addsong.js'),
    Signup = require('./models/Signup.js'),
    playlist = require('./models/Playlist'),
    favourite = require('./models/favourite'),
    User =  require('./models/Signup'),
    verify = require('./models/resetpassword'),
    deletereq = require('./models/RemoveUserReq'),
    seedDB = require('./seed'),
    songMroute = require('./routes/songM'),
    userMroute = require('./routes/userM'),
    favouriteroute = require('./routes/favourite'),
    fetchdataroute = require('./routes/fetchdata'),
    playlistroute = require('./routes/playlist'),
    indexroute = require('./routes/index'),
    forgetpasswordroute = require('./routes/forgetpassword');


app.use(require('express-session')({
    secret: 'secret is secret',
    resave: false,
    saveUninitialized: false
}));


var storage = multer.diskStorage({
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
});


var FileFilter = function (req, file, callback){
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
    };

var upload  = multer({storage: storage, fileFilter: FileFilter});     

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({

    usernameField: 'email',

  },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use(function(req,res,next){
     res.locals.currentUser = req.user;
     res.locals.error = req.flash('error');
     res.locals.success = req.flash('success');
     res.locals.info = req.flash('info');
     res.locals.favinfo = req.flash('favinfo');
     res.locals.logout = req.flash('logout');
     res.locals.remove = req.flash('remove');
     res.locals.notlogin = req.flash('notlogin');
     res.locals.sentemail = req.flash('sentemail');
     res.locals.changepassword = req.flash('changepassword');
     res.locals.editprofile = req.flash('editprofile');
     res.locals.userverify = req.flash('userverify');
     res.locals.removeuser = req.flash('removeuser');
     next();
 })

app.use('/songM',songMroute);
app.use('/userM',userMroute);
app.use('/favourite',favouriteroute);
app.use('/database',fetchdataroute);
app.use('/playlist',playlistroute);
app.use('/forgetpassword',forgetpasswordroute);
app.use('/',indexroute);

app.post('/Signin', isLoggedOut, passport.authenticate('local',
    {
        failureRedirect: '/Signin',           
        failureFlash: true,
        failureFlash: 'Invalid username or password.'
    }),function(req,res){
        if(!req.user.Userverify){
            req.logout();
            req.flash('userverify','Please verify your account');
            res.redirect('/Signin');

        }
        else if(req.user.Userverify){
            if(req.body.remember){
                req.session.cookie.maxAge = 86400000;
                if(req.user.rank === "Admin"){
                    req.flash('success','Welcome Admin');
                    res.redirect('/userM');
                }
                else if(req.user.rank === "Premium"){
                    var currentDate = new Date();
                    var timecheck = new Date(currentDate.getTime()).toUTCString();
                    console.log(timecheck);
                    User.findById(req.user.id,function(err,getuser){
                        if(err){
                            console.log(err);
                        }
                        else if(getuser){
                            if(timecheck >= getuser.PremiumExpired){
                                User.findByIdAndUpdate(req.user.id,{$set:{rank:"Member",PremiumExpired:""}},function(err,nopremium){
                                    if(err){
                                        console.log(err);
                                    }
                                    else if(nopremium){
                                        console.log("Premium Expired");
                                        req.flash('success','Logging in success');
                                        res.redirect('/main');
                                    }
                                })
                            }
                            else if(timecheck < getuser.PremiumExpired){
                                req.flash('info','Welcome back '+req.user.name);
                                res.redirect('/main');
                            }
                        }
                    })
                }
                else if(req.user.rank === "Member"){
                    req.flash('success','Logging in success');
                    res.redirect('/main');
                }
            }
            else if(!req.body.remember){
                req.session.cookie.expires = false;
                if(req.user.rank === "Admin"){
                    req.flash('success','Welcome Admin');
                    res.redirect('/userM');
                }
                else if(req.user.rank === "Premium"){
                    var currentDate = new Date();
                    var timecheck = new Date(currentDate.getTime()).toUTCString();
                    User.findById(req.user.id,function(err,getuser){
                        if(err){
                            console.log(err);
                        }
                        else if(getuser){
                            if(timecheck >= getuser.PremiumExpired){
                                User.findByIdAndUpdate(req.user.id,{$set:{rank:"Member",PremiumExpired:""}},function(err,nopremium){
                                    if(err){
                                        console.log(err);
                                    }
                                    else if(nopremium){
                                        console.log("Premium Expired");
                                        req.flash('success','Premium Expired');
                                        res.redirect('/main');
                                    }
                                })
                            }
                            else if(timecheck < getuser.PremiumExpired){
                                req.flash('info','Welcome back '+req.user.name);
                                res.redirect('/main');
                            }
                        }
                    })
                }
                else if(req.user.rank === "Member"){
                    req.flash('success','Logging in success');
                    res.redirect('/main');
                }
            }
        }
        
});

app.get('/landing', function(req,res){
    res.render('landingpage.ejs');
})

app.get('*', function(req,res){
    res.render('wrongpath.ejs');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('notlogin', 'You must be logged in first');
    res.redirect('/Signin');
}

function isLoggedOut(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/main');
    }
    next();
}

function sendEmail(email,uniqueString){
    var user = "flexmusicmek@gmail.com";
    var password = "flexmek0849261272";
    var Transport = nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:user,
            pass:password
        }
    });
    console.log(uniqueString);
    const link = "http://localhost:3000/verify/"+uniqueString;
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


// -> for the port ** Tips: this code should stay at the bottom of the code 
// -> if you paste it at the place that not at the bottom maybe it will break 
// -> so I recommend to stay here and if you want to add more code
// -> you can add the code between line 21 - 1140
app.listen( port, function(req,res){
    console.log("The server has been connect by port : " + port);
});
