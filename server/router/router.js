const express = require("express");
const userModel = require("../model/userModel");
const message = require("../message");
const router = express.Router();
const bcrypt = require("bcrypt");
const logger = require("../logger");

router.post("/register", async(req,res) =>{
    try{
        const email_exist = await userModel.findOne({email : req.body.email});
        const username_exist = await userModel.findOne({username : req.body.username});
        if(username_exist || email_exist ){
            return res.status(process.env.BAD_REQUEST).json({
                success : false,
                message : email_exist ? message.EMAIL_ALREADY_EXIST : message.USERNAME_ALREADY_EXIST
            })
        }else {
            const password = await bcrypt.hash(req.body.password, 10);
            const user = await new userModel({
                username : req.body.username,
                email : req.body.email,
                password : password
            });
            await user.save();
            return res.status(process.env.SUCCESS).json({
                success : true,
                message : message.USER_CREATED,
                data : {
                    id : user._id,
                    username : user.username,
                    email : user.email,
                    isAvatarImageSet : user.isAvatarImageSet,
                    avatarImage : user.avatarImage
                }
            })
        } 
    }catch(err){
        logger.log(`register api`, err.message);
        res.status(process.env.INTERNAL_SERVER_ERROR).json({
            success : false,
            message : err.message
        })
    }
})

router.post("/login", async(req,res) =>{
    try{
        const user = await userModel.findOne({email : req.body.email});
        if(user){
            const password = await bcrypt.compare(req.body.password, user.password);
            if(password){
                return res.status(process.env.SUCCESS).json({
                    success : true,
                    message : message.LOGIN_SUCCESS,
                    data : {
                        id : user._id,
                        username : user.username,
                        email : user.email,
                        isAvatarImageSet : user.isAvatarImageSet,
                    avatarImage : user.avatarImage
                    }
                })
            }else{
                return res.status(process.env.BAD_REQUEST).json({
                    success : false,
                    message : message.CREDIENTIAL_ERROR
                })
            }
        }else{
            return res.status(process.env.BAD_REQUEST).json({
                success : false,
                message : message.CREDIENTIAL_ERROR
            })
        }
    }catch(err){

    }
})

router.patch("/set-avatar/:user_id", async(req,res) =>{
    try{
        const user = await userModel.findByIdAndUpdate({_id : req.params.user_id}, {avatarImage : req.body.avatarImage, isAvatarImageSet : true});
        if(!user) throw new Error('unable to update')
            return res.status(process.env.SUCCESS).json({
                success : true,
                message : message.SET_AVATAR_SUCCESS,
                data : {
                    isAvatarImageSet : true, avatarImage : req.body.avatarImage
                }
            })
    }catch(err){
        logger.log(`set-avatar api`, err.message);
    }
})

router.get("/all-user/:user_id", async(req,res) =>{
    try{
        const users = await userModel.find({_id : {$ne : req.params.user_id }}).select(["_id","username","email", "avatarImage"]);
        return res.status(process.env.SUCCESS).json({
            success : true,
            message : message.USER_FOUND,
            data : users.length ? users  : []
        })

    }catch(error){
        logger.log(`all-user api`, error.message);
    }
})
module.exports = router