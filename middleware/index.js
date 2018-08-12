var Campground = require("../models/photo.js");
var Comment = require("../models/comment.js");
// all middlewares
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Photo not found");
                res.redirect("/photos");
            }else{
                //does the current user own the campground?
                // ATTENTION: foundCampground.author.id is an object, while req.user._id
                // is a String. We CANNOT simply compare them
                // .equals() is a built in mongoose method
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "You have to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Photo not found");
                res.redirect("/photos");
            }else{
                //does the current user own the campground?
                // ATTENTION: foundCampground.author.id is an object, while req.user._id
                // is a String. We CANNOT simply compare them
                // .equals() is a built in mongoose method
                console.log()
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You do not have permission to do that");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "You have to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    //set the value of error status of req, so that it can be used for only one time the 
    //in req, 
    req.flash("error", "You have to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;