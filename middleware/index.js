var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('notlogin', 'You must be logged in first!');
    res.redirect('/Signin');
}

middlewareObj.isLoggedOut = function(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect('/main');
    }
    next();
}

module.exports = middlewareObj;