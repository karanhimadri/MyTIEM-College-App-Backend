const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher")

const markAttendance = async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    const attendances = req.body;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({ message: "Attendance array is required" });
    }

    // Add teacher ID and format date
    const attendanceDocs = attendances.map((entry) => ({
      student: entry.studentId,
      subject: entry.subject,
      date: new Date(entry.date),
      status: entry.status,
      markedBy: teacherId,
    }));

    const savedDocs = await Attendance.insertMany(attendanceDocs);

    res.status(201).json({
      message: "Bulk attendance marked successfully",
      insertedCount: savedDocs.length,
    });
  } catch (error) {
    console.error("Bulk attendance error:", error);
    res.status(500).json({ message: "Server error while marking bulk attendance" });
  }
};

const getAllAssignedStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher._id)
      .populate("students"); // fetch all student details

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({
      message: "Students fetched successfully",
      students: teacher.students, // This now contains full student objects
    });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addAnnouncement = async (req, res) => {
  try {
    const teacherId = req.teacher._id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Announcement message is required" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    teacher.announcements.push({ message });
    await teacher.save();

    res.status(201).json({ message: "Announcement added successfully" });
  } catch (error) {
    console.error("Announcement error:", error);
    res.status(500).json({ message: "Server error while adding announcement" });
  }
};

module.exports = {
  markAttendance,
  getAllAssignedStudents,
  addAnnouncement
}
