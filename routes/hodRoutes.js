const express = require("express")
const { registerHod, loginHod, createTeacher, createStudent, assignTeacherToStudent, makeAnnouncement, uploadClassSchedule } = require("../controllers/hodController")
const protectHOD = require("../middlewares/hodMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// public HOD Routes
router.post("/hod/register", registerHod);
router.post("/hod/login", loginHod);

// protected HOD's routes
router.post("/hod/teacher/create", protectHOD, createTeacher)
router.post("/hod/student/create", protectHOD, createStudent)
router.post("/hod/student/assign-teacher-to-student", protectHOD, assignTeacherToStudent)
router.post("/hod/create-announcement", protectHOD, makeAnnouncement);
router.post("/hod/upload-class-schedule", protectHOD, upload.single("file"), uploadClassSchedule)

module.exports = router
