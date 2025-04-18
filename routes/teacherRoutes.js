const express = require("express")
const teacherMiddleware = require("../middlewares/teacherMiddleware");
const { markAttendance, getAllAssignedStudents, addAnnouncement } = require("../controllers/teacherController");

const router = express.Router();

router.post("/mark-attendences", teacherMiddleware, markAttendance);
router.get("/get-all-students", teacherMiddleware, getAllAssignedStudents);
router.post("/add-announcement", teacherMiddleware, addAnnouncement)

module.exports = router
