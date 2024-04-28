import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const postAppointment = catchAsyncError(async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    department,
    appointment_Date,
    hasvisited,
    doctor_firstname,
    doctor_lastname,
    address
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !department ||
    !appointment_Date ||
    !doctor_firstname ||
    !doctor_lastname
  ) {
    return next(new ErrorHandler("Please fill full form"), 400);
  }
  const isConflict = await User.find({
    firstname: doctor_firstname,
    lastname: doctor_lastname,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not founds", 400));
  }
  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors conflict ! Please contact through email or Phone",
        400
      )
    );
  }
  const doctorid = isConflict[0]._id;
  const patientid = req.user._id;
  const appointment = await Appointment.create({
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    department,
    doctor:{
        firstname:doctor_firstname,
        lastname: doctor_lastname,
    },
    appointment_Date,
    hasvisited,
    doctorid,patientid ,address})
    res.status(200).json({
        success:true,
        message:"Appointment sent Successfully",
        appointment
    })
});

export const getAllAppointment=catchAsyncError(async (req,res,next)=>{
  const appointments=await Appointment.find()
  res.status(200).json({
    success:true,
    appointments
  })
})

export const updateAppointmentStatus=catchAsyncError(async(req,res,next)=>{
  const { id } = req.params
  let appointment=await Appointment.findById(id)
  if(!appointment)
  {
    return next(new ErrorHandler("Appointment not found",404))
  }
   appointment=await Appointment.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true,
    useFindAndModify:false
   })
   res.status(200).json({
    success:true,
    message:"Appointment status Updated",
    appointment
   })
})

export const deleteAppointment=catchAsyncError(async(req,res,next)=>{
  const {id}=req.params
   const appointment=await Appointment.findById(id)
   if(!appointment)
   {
    return next(new ErrorHandler("Appointment not found",404))
   }
   await appointment.deleteOne()
   res.status(200).json({
    success:true,
    message:"Appointment Deleted",
    
   })
})