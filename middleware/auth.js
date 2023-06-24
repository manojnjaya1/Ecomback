const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
exports.isAuthenticatedUser=catchAsyncErrors(async(req,res,next)=>{
    const {token}=req.cookies;
//console.log(req.user);
if(!token){
    return next(new ErrorHandler("please login to access",401));
}


const decodedData=jwt.verify(token,process.env.JWT_SECRET);

req.user=await User.findById(decodedData.id);

next();
})

exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
       // console.log(req.user);
        if(!roles.includes(req.user.role)){
        return next(
             new ErrorHandler(
                `Role: ${req.user.role} is not allowed to do this`,
                403)
                );
        }
        next();
    };
}