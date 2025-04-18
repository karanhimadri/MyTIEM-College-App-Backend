const express = require("express")
const { loginStudent, loginTeacher } = require("../controllers/authController")

const router = express.Router();

// public routes
router.post("/teacher/login", loginTeacher);
router.post("/student/login", loginStudent)

module.exports = router
