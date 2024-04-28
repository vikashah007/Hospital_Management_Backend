import { Message } from "../models/messageSchema.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import  ErrorHandler from "../middlewares/errorMiddleware.js"


export const sendMessage=catchAsyncError(async (req,res,next)=>{
    const {firstname,lastname,email,phone,message}=req.body
     if(!firstname || !lastname || !email || !phone || !message)
     {
        return next(new ErrorHandler("please fill Full Form !",500))
     }
     await Message.create({firstname,lastname,email,phone,message})
     res.status(200).json({
        success:true,
        message:"Message sent successfuly"
     })
    })

export const getAllMessages=catchAsyncError(async(req,res,next)=>{
     const messages=await Message.find()
     res.status(200).json({
      success:true,
      messages
     })
})