import mongoose from "mongoose";
import validator from "validator";

const messageSchema=new mongoose.Schema({
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
     message:{
        type:String,
        required:true,
        minlength:[11,'message contain atleast 10 charecters'],
     }
})
export const Message=mongoose.model("Message",messageSchema)