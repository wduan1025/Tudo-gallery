var express = require("express");
var router = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")
//new route for comment
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });
    //render
});
// isLoggedIn is here to prevent someone who directly send post request to this page
// and thus adds a new comment
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
   //lookup campground using id
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }else{
           // add username and id to comment
           console.log("new comment author username will be: ", req.user.username)
           //because there is isLoggedIn, the user here should not be undefined
           req.user
           //Comment.create
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   req.flash("error", "Something went wrong");
                   console.log(err);
               }else{
                   comment.author.username = req.user.username;
                   comment.author.id = req.user._id;
                   comment.save();
                   campground.comments.push(comment._id);
                   campground.save();
                   console.log("added comment " +comment);
                   req.flash("success", "Successfully added comment");
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect to campground show page
});

// EDIT COMMENT
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campgroundId:req.params.id, comment:foundComment});     
        }
    });
});
// UPDATE COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

// COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;