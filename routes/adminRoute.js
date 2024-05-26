const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsersController, getAllDoctorsController,changeDoctorStatusController } = require('../controller/adminController');
const router = express.Router();

router.get('/getAllUsers',authMiddleware,getAllUsersController)
router.get('/getAllDoctors',authMiddleware,getAllDoctorsController)
router.post('/changeDoctorStatus',authMiddleware,changeDoctorStatusController)
module.exports = router;