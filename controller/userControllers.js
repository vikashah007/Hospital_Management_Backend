import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtTokens.js"
import cloudinary from "cloudinary"

export const patientRegister=catchAsyncError(async(req,res,next)=>{
    const {firstname,lastname,email,phone,nic,password,dob,gender, role}=req.body
    if(!firstname || !lastname || !email || !phone || !nic || !password || !dob || !gender || !role)
    {
        return next(new ErrorHandler("please fill full form",400))
    }
    let user=await User.findOne({email})
    if(user){
        return next("user already registered!",400)
    }
    user=await User.create({firstname,lastname,email,phone,nic,password,dob,gender, role})
    generateToken(user,"User Registered!",200,res)
})

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,confirmpassword,role}=req.body

    if(!email || !password || !confirmpassword || !role)
    {
        return next(new ErrorHandler("please provide all details" ,400))
    }
    if(password !==confirmpassword)
    {
        return next(new ErrorHandler("password and confirm password donot match" ,400))
    }
    const user=await User.findOne({email}).select("+password")
    if(!user)
    {
        return next(new ErrorHandler("Invalid password or email" ,400))
    }
    const isPasswordMatched=await user.comparePassword(password)
    if(!isPasswordMatched)
    {
        return next(new ErrorHandler("Invalid password or email" ,400))
    }
    if(role!==user.role)
    {
        return next(new ErrorHandler("user with this role not found" ,400))
    }
    generateToken(user,"User logged in successfully!",200,res)
})

export const addNewAdmin=catchAsyncError(async(req,res,next)=>{
    const {firstname,lastname,email,phone,nic,password,dob,gender}=req.body
    if(!firstname || !lastname || !email || !phone || !nic || !password || !dob || !gender)
    {
        return next(new ErrorHandler("please fill full form",400))
    }
    const isRegistered=await User.findOne({email})
    if(isRegistered)
    {
        return next(new ErrorHandler(` ${isRegistered.role} with this email already exist` ,400))
    }
    const admin=await User.create({firstname,lastname,email,phone,nic,password,dob,gender,role:"Admin"})
    res.status(200).json({
        success:true,
        message:"new admin registered"
    })

})

export const getAllDoctors=catchAsyncError(async(req,res,next)=>{
    const doctors=await User.find({role:"Doctor"})
    res.status(200).json({
        success:true,
        doctors
    })
})
export const getUserDetails=catchAsyncError(async(req,res,next)=>{
    const user=req.user
    res.status(200).json({
        success:true,
        user
    })
})

export const logoutAdmin=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        httpOnly:true,
        secure:true,
      sameSite:"None",
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"Admin Logged Out Successfully"
    })
})
export const logoutPatient=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("patientToken","",{
        httpOnly:true,
        secure:true,
      sameSite:"None",
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"patient Logged Out Successfully"
    })
})


export const addNewDoctor=catchAsyncError(async(req,res,next)=>{
    if(!req.files || Object.keys(req.files).length===0)
    {
        return next(new ErrorHandler("Doctor Avtar required" ,400))
    }
    const {docAvtar}=req.files
    const allowedFormats=["image/png","image/jpeg","image/webp"]
    if(!allowedFormats.includes(docAvtar.mimetype)){
        return next(new ErrorHandler("File formate not supported",400))
    }
    const {firstname,lastname,email,phone,nic,password,dob,gender,doctorDepartment}=req.body
    if(!firstname || !lastname || !email || !phone || !nic || !password || !dob || !gender || !doctorDepartment)
    {
        return next(new ErrorHandler("Please provide full detail" ,400))
    }
    const isRegistered=await User.findOne({email})
    if(isRegistered)
    {
        return next(new ErrorHandler(`${isRegistered.role} already registered with this email` ,400))
    }
    const cloudinaryResponse=await cloudinary.uploader.upload(docAvtar.tempFilePath)
    if(!cloudinaryResponse ||  cloudinaryResponse.error)
    {
        console.log("Cloudinary Error : ", cloudinaryResponse.error || "Unkown Cloudinary Error")
    }
    const doctor=await User.create({firstname,lastname,email,phone,nic,password,dob,gender,doctorDepartment,role:"Doctor",
    docAvatar:{
        public_id:cloudinaryResponse.public_id,
        url:cloudinaryResponse.secure_url,
     }       
     })
     res.status(200).json({
        success:true,
        // message:"new doctor Registered !",
        doctor
     })

})




// mongodb://127.0.0.1:27017/hospital