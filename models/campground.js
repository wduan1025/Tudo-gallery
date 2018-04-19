var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price:String,
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author:{
        username:String,
        id:mongoose.Schema.Types.ObjectId
    }
})

var Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;