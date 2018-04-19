var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    flash = require("connect-flash");
// requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
    
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//seedDB(); seed the database
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
//__dirname is the dir of app.js
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb://localhost/yelp_camp");

//passport configuration
app.use(require("express-session")({
    secret: "Once again Rusty",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// a middleware that will run after every request, so that we don't have to manually
// pass the req.user to the currentUser of the page directed to everytime
// very interesting use of middleware
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
//append /campgrounds in front of every router
//app.use("/campgrounds", commentRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("YelpCamp server has started");
})