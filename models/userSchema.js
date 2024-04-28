import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minlength:[3,'firstname contains atleast 3 charecter'],
    },
    lastname:{
        type:String,
        required:true,
        minlength:[3,'lastname contains atleast 3 charecter'],
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,'please provide a valid email']
    },
    phone:{
        type:String,
        required:true,
        minlength:[11,'phone number contain atleast 11 digits'],
        maxlength:[11,'phone number contain atmost 11 digits'],
    },
     nic:{
        type:String,
        required:true,
        minlength:[12,'nic contains atleastd 12 digit'],
     },
     dob:{
        type:String,
        required:[true,"DOB is required"]
     },
     gender:{
        type:String,
        required:true,
        enum:["Male","Female"],
     },
     password:{
        type:String,
        required:true,
        minlength:[8,'password muyst contain atleast 8 charecters'],
        select:false,
     },
     role:{
        type:String,
        required:true,
        enum:["Admin","Doctor","Patient"]
     },
     doctorDepartment:{
        type:String
     },
     docAvatar:{
        public_id:String,
        url:String,
     }

})

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
    {
        next()
    }
    this.password=await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword=async function(enterPassword)
{
    return await bcrypt.compare(enterPassword,this.password)
}

userSchema.methods.generateJsonWebToken=function()
{
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES})
}

export const User=mongoose.model("User",userSchema)