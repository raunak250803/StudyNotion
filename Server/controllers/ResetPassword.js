const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcryptjs');
//resetPasswordToken
exports.resetPasswordToken = async(req, res) => {
    try{
        //get email from req body
        const email = req.body.email;
        //check user for email
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({success: false, 
                message: "Your Email is not registered with us"
            });
        }
        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new:true}
        );
        const url = `http:localhost:3000/update-password/${token}`;
        //send mail containing the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link: ${url}`);
        //return response
        return res.json({success:true, message:"Email sent successfully, please check mail and change password."});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occoured while resetting password."
        });
    }
}
//resetPassword

exports.resetPassword = async (req, res) => {
    try{
        //data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Passwords not matching"
            })
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token: token});
        //if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token invalid"
            })
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired"
            })
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);
        //password update
        await User.findOneAndUpdate(
            {
                token:token,
            },
            {
                password:hashedPassword
            },
            {new: true},
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Password is changed."
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error occoured while changing password"
        })
    }
}
