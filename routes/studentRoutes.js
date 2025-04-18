const express = require("express")
const studentMiddleware = require("../middlewares/studentMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadNewProfileImage, getAnnouncementsFromSpecificTeacher, getStudentProfile, addStudentDetails, getMonthlyAttendanceStats, getClassSchedule } = require("../controllers/studentController");

const router = express.Router();

router.post("/profile/upload", studentMiddleware, upload.single("file"), uploadNewProfileImage);
router.get("/profile", studentMiddleware, getStudentProfile);
router.post("/add-details", studentMiddleware, addStudentDetails);
router.post("/class-schedule", studentMiddleware, getClassSchedule);

// GET /api/student/attendance/monthly?teacherId=661fbb0195fa4283f2927db4&month=4&year=2025
router.post("/attendance/monthly", studentMiddleware, getMonthlyAttendanceStats)

// GET /student/teacher-announcements?teacherId=TEACHER_ID
router.get("/teacher-announcements", studentMiddleware, getAnnouncementsFromSpecificTeacher);

module.exports = router
