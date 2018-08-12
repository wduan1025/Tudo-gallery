var express = require("express");
var router = express.Router();
var Campground = require("../models/photo");
//if we require a directory, the index.js inside will be automatically required
var middleware = require("../middleware");

router.get("/photos", function(req, res){
        //res.render("campgrounds", {campgrounds:campgrounds});
        //get all campgrounds
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            }else{
                // we also pass in the user information for the header
                // since header file is glued to index.ejs eventually, we can directly use currentUser in the header.ejs
                res.render("photos/index", {campgrounds:allCampgrounds, currentUser:req.user});
            }
        });
});

router.post("/photos", middleware.isLoggedIn, function(req, res){
    //get data from form
    //var newCampground = req.body.xxx;
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    //add to campgrounds
    var author = {
        username:req.user.username, 
        id:req.user._id
    };
    var newCampground = {name:name, image:image, price:price, description:desc, author:author};
    Campground.create(newCampground, function(err, c){
            if(err){
                console.log(err);
            }else{
                console.log("newly created photo");
                console.log(c);
            }
        
    });
    //redirect back to campgrounds
    res.redirect("/photos");
});

router.get("/photos/new", middleware.isLoggedIn, function(req, res){
    res.render("photos/new");
});
//show route
router.get("/photos/:id", function(req, res){
    //find the campground with the provided id
    //use populate to replace id with comments
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //if not populate, the console.log.comments will be ids
            res.render("photos/show", {campground:foundCampground});
        }
    });
    //render the show page of this campground
});


// EDIT CAMPTROUD ROUTE
router.get('/photos/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            console.log(err);
        }else{
            res.render("photos/edit", {campground:foundCampground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/photos/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/photos");
        }else{
            res.redirect("/photos/" + req.params.id);
        }
    });
});
//DELETE CAMPGROUND ROUTE
router.delete("/photos/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/photos");
        }else{
            res.redirect("/photos")
        }
    })
});

module.exports = router;