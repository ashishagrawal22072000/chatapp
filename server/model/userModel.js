const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type : String
    },
    email : {
        type : String,
    },
    password: {
        type : String
    },
    isAvatarImageSet : {
        type : Boolean,
        default : false
    },
    avatarImage: {
        type : String,
        default : ""
    }
})

const userModel = mongoose.model("User", userSchema);
module.exports = userModel