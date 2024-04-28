import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from 'jsonwebtoken'
export const isAdminAuthenticated=catchAsyncError(async(req,res,next)=>{
      const token=req.cookies.adminToken
      if(!token)
      {
        return next("Admin not authenticated",400)
      }
   const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
   req.user=await User.findById(decoded.id)
   if(req.user.role!=="Admin")
   {
    return next(`${req.user.role} is not autherised for this role! `,403)
   }
     next();
})
export const isPatientAuthenticated=catchAsyncError(async(req,res,next)=>{
      const token=req.cookies.patientToken
      if(!token)
      {
        return next("Patient not authenticated",400)
      }
   const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
   req.user=await User.findById(decoded.id)
   if(req.user.role!=="Patient")
   {
    return next(`${req.user.role} is not autherised for this role! `,403)
   }
     next();
})