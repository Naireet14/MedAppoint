const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDoctorInfoByIdController,
} = require("../controller/doctorController");
const {
  getDoctorInfoByIddController,
} = require("../controller/doctorController");
const {
  updateDoctorProfileController,
} = require("../controller/doctorController");
const {
  getAppointmentsbyDoctorController,
}=require("../controller/doctorController");
const {
  changeAppointmentStatusController,
}=require("../controller/doctorController")
const router = express.Router();




router.post("/getDoctorInfo", authMiddleware, getDoctorInfoByIdController);


router.post(
  "/getDoctorInfoByIdd",
  authMiddleware,
  getDoctorInfoByIddController
);
router.post(
  "/updateDoctorProfile",
  authMiddleware,
  updateDoctorProfileController
);

router.get(
  "/get-appointments-by-doctor-id",
  authMiddleware,
  getAppointmentsbyDoctorController
);
router.post('/changeAppointmentStatus',authMiddleware,changeAppointmentStatusController)

module.exports = router;
