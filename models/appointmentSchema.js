import mongoose from "mongoose"
import validator from "validator"

const appointmentSchema=new mongoose.Schema({
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
     appointment_Date:{
        type:String,
        required:true
     },
     department:{
        type:String,
        required:true
     },
     doctor:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        }
     },
     hasvisited:{
            type:Boolean,
            default:false
     },
     doctorid:{
        type:mongoose.Schema.ObjectId,
        required:true,
     },
     patientid:{
        type:mongoose.Schema.ObjectId,
        required:true,
     },
     address:{
        type:String,
        required:true
     },
     status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
     }

})

export const Appointment=mongoose.model("Appointment",appointmentSchema)