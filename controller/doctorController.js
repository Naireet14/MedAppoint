const doctorModel = require("../models/doctorModel");
const Appointment=require("../models/appointmentModel")
const userModel=require("../models/userModel")
const getDoctorInfoByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });

    res.status(200).send({
      success: true,
      message: "Doctor info fetched succesfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in doctor Info",
      error,
    });
  }
};

const getDoctorInfoByIddController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });

    res.status(200).send({
      success: true,
      message: "Doctor info fetched succesfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in doctor Info",
      error,
    });
  }
};
const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );

    res.status(200).send({
      success: true,
      message: "Doctor Profile Updated succesfully",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in doctor Info",
      error,
    });
  }
};
const getAppointmentsbyDoctorController=async(req,res)=>{
  try {
    const doctor=await doctorModel.findOne({userId:req.body.userId})
    const appointments = await Appointment.find({ doctorId:doctor._id });
    res.status(200).send({
      success: true,
      message: "Appointments List",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching appointments",
      error,
    });
  }
}

const changeAppointmentStatusController=async(req,res)=>{
  try {
    const {appointmentId,status}=req.body;
    const appointment=await Appointment.findByIdAndUpdate(appointmentId,{
        status,
    })
   

    const user=await userModel.findOne({_id: appointment.userId});
    const unSeenNotification = user.unSeenNotification;
    unSeenNotification.push({
        type: "appointment-status-changed",
        message: `Your appointment has been ${status}`,
        onClickPath: "/appointments"

    })
    user.isDoctor= status==="approved" ? true : false;
    await user.save();

    
    res.status(200).send({
        success:true,
        message:'Appointment status updated successfully',
        
    });
} catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'error while updating the status',
        error
    })
}
}
module.exports = {
  getDoctorInfoByIdController,
  updateDoctorProfileController,
  getDoctorInfoByIddController,
  getAppointmentsbyDoctorController,
  changeAppointmentStatusController,
};
