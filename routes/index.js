var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

//===============================================================================
//AUTH ROUTES
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("/register");
        }else{
            //put everything in session(including logging the user in)
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to PotatoAlbum " + user.username);
                res.redirect("/photos");
            });
        }
    });
});
//login route
router.get("/login", function(req, res){
    res.render("login");
});
//use middleware to see if login successful
router.post("/login", passport.authenticate("local", {
    successRedirect: "/photos",
    failureRedirect: "/login"
}), function(req, res){});



//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/photos");
});


module.exports = router;