const express = require("express");
const {
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
} = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/getUser", authMiddleware, getUserInfoByIdController);

router.post("/apply-doctor-account", authMiddleware, applyDoctorController);

router.post(
  "/mark-all-notifications-as-seen",
  authMiddleware,
  markallSeenController
);

router.post(
  "/delete-all-notifications",
  authMiddleware,
  deleteAllNotificationController
);

router.get(
  "/get-all-approved-doctors",
  authMiddleware,
  getAllApprovedDoctorsController
);
router.post("/book-appointment", authMiddleware, bookAppointmentController);

router.post(
  "/check-booking-availability",
  authMiddleware,
  checkAvailabilityController
);
router.get(
  "/get-appointments-by-user-id",
  authMiddleware,
  getAppointmentsbyUserController
);
module.exports = router;
