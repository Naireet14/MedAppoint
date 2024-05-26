const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const moment = require("moment");

const registerController = async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });

    //validation
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      confirmpassword: confirmpassword,
    });
    //generate token
    const token = jwt.sign(
      { email: result.email, id: result._id },
      process.env.JWT_SECRET
    );

    return res.status(201).send({
      user: result,
      token: token,
      success: true,
      message: "Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

//login call back
const loginController = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: req.body.email });

    //validation
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    //Compare password
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(200)
        .send({ message: "Invalid Password", success: false });
    } else {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).send({
        success: true,
        message: "Login Successfully",
        user: user,
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login API",
      error,
    });
  }
};

const getUserInfoByIdController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    } else {
      return res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getUser API",
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newdoctor = new Doctor({ ...req.body, status: "pending" });
    await newdoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });

    const unSeenNotification = adminUser.unSeenNotification;
    unSeenNotification.push({
      type: "new-doctor-request",
      message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account!`,
      data: {
        doctorId: newdoctor._id,
        name: newdoctor.firstName + " " + newdoctor.lastName,
      },
      onClickPath: "/admin/doctors",
    });
    await userModel.findByIdAndUpdate(adminUser._id, { unSeenNotification });
    return res.status(201).send({
      success: true,
      message: "Doctor Account applied Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Apply Doctor API",
      error,
    });
  }
};
const markallSeenController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const unSeenNotification = user.unSeenNotification;
    const seenNotification = user.seenNotification;
    seenNotification.push(...unSeenNotification);
    user.unSeenNotification = [];
    user.seenNotification = seenNotification;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    return res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Seen Notifications API",
      error,
    });
  }
};

const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    user.seenNotification = [];
    user.unSeenNotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    return res.status(200).send({
      success: true,
      message: "All notifications are deleted.",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete Notifications API",
      error,
    });
  }
};

const getAllApprovedDoctorsController = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors data List",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching doctors data",
      error,
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {
    req.body.status = "pending";
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    //pushing notification to doctor based on his user id
    const user = await User.findOne({ _id: req.body.doctorInfo.userId });
    user.unSeenNotification.push({
      type: "new-appointment-request",
      message: ` A new appointment request has been made by ${req.body.userInfo.name}`,
      onClickPath: "/doctor/appointments",
    });
    await user.save();
    res.status(200).send({
      message: "Appointment Booked Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Booking Appointment",
      error,
    });
  }
};

const checkAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH-mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await Appointment.find({
      doctorId,
      date,
      time: { $gte: fromTime, $lte: toTime },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Slots are not available",
        success: false,
      });
    } else {
      return res.status(200).send({
        message: "Slots are available",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Booking Appointment",
      error,
    });
  }
};

const getAppointmentsbyUserController=async(req,res)=>{
  try {
    const appointments = await Appointment.find({ userId:req.body.userId });
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

module.exports = {
  registerController,
  loginController,
  getUserInfoByIdController,
  applyDoctorController,
  markallSeenController,
  deleteAllNotificationController,
  getAllApprovedDoctorsController,
  bookAppointmentController,
  checkAvailabilityController,
  getAppointmentsbyUserController,
};
