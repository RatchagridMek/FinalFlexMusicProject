var express = require('express'),
    { ObjectID } = require('bson'),
    router = express.Router(),
    flash = require("connect-flash"),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    Signup = require('../models/Signup.js'),
    verify = require('../models/resetpassword'),
    middleware = require('../middleware');

    router.get('/', middleware.isLoggedOut, function(req,res){
        res.render('forgetpass.ejs');
    })
    
    router.post('/', middleware.isLoggedOut, function(req,res){
        var email = req.body.email;
        var random = cryptorandom();
        Signup.find({email:email},function(err,find){
            if(err){
                console.log(err);
            }
            else if(find){
                sendEmail(email,random);
                verify.create({email:email,verifyCode:random},function(err,pass){
                    if(err){
                        console.log(err);
                    }
                    else if(pass){
                        req.flash('sentemail','Email has been sent');
                        res.redirect('/forgetpassword');
                    }
                })
            }
        })
    });
    
    router.get('/wait', middleware.isLoggedOut, function(req,res){
        res.send("Check your email for verification");
    })

    // verify method from email
    router.get('/verify/:id', middleware.isLoggedOut, function(req,res){
        var string = req.params.id;
        if(string === "null"){
            res.redirect('/wrongverify');
        }
        else{
                verify.findOne({verifyCode:string},function(err,pass){
                if(err){
                    ocnsole.log(err);
                }
                else if(pass){
                    var currentDate = new Date();
                    var timecheck = new Date(currentDate.getTime()).toUTCString();
                    console.log("Started at : "+timecheck);
                    console.log("Token Invalid at : "+pass.tokenRelease);
                    if(timecheck > pass.tokenRelease){
                        console.log("failed time over");
                        verify.updateOne({verifyCode:pass.verifyCode},{$set:{verifyCode:"null"}},function(err,gonull){
                            if(err){
                                console.log(err);
                            }
                            else if(gonull){
                                console.log("The token change to null already");
                                res.redirect('/wrongverify');
                            }
                        })
                    }
                    else if(timecheck <= pass.tokenRelease){
                        console.log("Ok you can pass");
                        res.render("resetpassword.ejs",{email:pass.email});
    
                    }
                }
                else{
                    res.redirect('/wrongverify');
                }
            });
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
        const link = "http://localhost:3000/forgetpassword/verify/"+uniqueString;
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
