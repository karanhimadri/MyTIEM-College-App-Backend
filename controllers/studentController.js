const Student = require("../models/Student");
const UploadFile = require("../models/UploadFile");
const Teacher = require("../models/Teacher");
const Attendance = require("../models/Attendance");
const Hod = require("../models/Hod")

// Upload Student Profile Image 
const uploadNewProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path, filename, originalname, mimetype, size } = req.file;
    const student = req.student;

    const upload = await UploadFile.create({
      publicUrl: path,
      filename: filename,
      fileType: "image",
    });

    student.profileDetails = {
      profileUrl: path,
      uploadId: upload._id
    };
    await student.save();

    return res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profileUrl: path,
      filename: filename,
      originalName: originalname,
      type: mimetype,
      sizeInBytes: size,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: 'Profile picture upload failed', error: error.message });
  }
};

// For getting Announcements
const getAnnouncementsFromSpecificTeacher = async (req, res) => {
  try {
    const studentId = req.student._id;
    const teacherId = req.query.teacherId;
    if (!teacherId) {
      return res.status(400).json({ message: "teacherId is required in query" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Check if the teacher is assigned to this student
    const isAssigned = student.teachers.includes(teacherId);
    if (!isAssigned) {
      return res.status(403).json({ message: "Not authorized to view this teacher's announcements" });
    }

    const teacher = await Teacher.findById(teacherId).select("username announcements");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const sortedAnnouncements = [...teacher.announcements].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      teacher: teacher.username,
      announcements: sortedAnnouncements,
    });

  } catch (error) {
    console.error("Error fetching teacher announcements:", error);
    res.status(500).json({ message: "Server error while fetching announcements" });
  }
};

const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.student._id;

    const student = await Student.findById(studentId)
      .populate("teachers", "username _id")
      .populate("hod", "username _id")
      .populate("profileDetails.uploadId", "filename publicUrl")
      .lean(); // Return plain JS object

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addStudentDetails = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { gender, email, dob, phone, address1, city, state } = req.body;

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update fields
    student.gender = gender || student.gender;
    student.email = email || student.email;
    student.dob = dob || student.dob;
    student.phone = phone || student.phone;

    student.address.addressLine1 = address1 || student.address.addressLine1;
    student.address.city = city || student.address.city;
    student.address.state = state || student.address.state;

    // Save updates
    await student.save();

    res.status(200).json({
      message: "Student details updated successfully",
      studentId: student._id
    });

  } catch (error) {
    console.error("Error updating student details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMonthlyAttendanceStats = async (req, res) => {
  try {
    const studentId = req.student._id;
    const { teacherId, month, year } = req.query;

    if (!teacherId || !month || !year) {
      return res.status(400).json({ message: "teacherId, month, and year are required in query params" });
    }

    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    if (
      isNaN(numericMonth) || numericMonth < 1 || numericMonth > 12 ||
      isNaN(numericYear) || numericYear < 1900
    ) {
      return res.status(400).json({ message: "Invalid month or year" });
    }

    // Construct date range
    const startDate = new Date(numericYear, numericMonth - 1, 1);  // JS months are 0-indexed
    const endDate = new Date(numericYear, numericMonth, 1);        // start of next month

    const records = await Attendance.find({
      student: studentId,
      markedBy: teacherId,
      date: { $gte: startDate, $lt: endDate }
    });

    const presentCount = records.filter(r => r.status === "present").length;
    const absentCount = records.filter(r => r.status === "absent").length;

    res.status(200).json({
      studentId,
      teacherId,
      month: numericMonth,
      year: numericYear,
      present: presentCount,
      absent: absentCount
    });

  } catch (error) {
    console.error("Attendance stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getClassSchedule = async (req, res) => {
  try {
    const studentId = req.student._id;

    // Find student and populate HOD details
    const student = await Student.findById(studentId).populate('hod');

    if (!student || !student.hod) {
      return res.status(404).json({ message: "Student or HOD not found" });
    }

    const { section_A, section_B } = student.hod.classSchedules;

    res.status(200).json({
      semester: student.hod.classSchedules.semester,
      sectionA: {
        scheduleUrl: section_A.scheduleUrl,
        uploadId: section_A.uploadId,
      },
      sectionB: {
        scheduleUrl: section_B.scheduleUrl,
        uploadId: section_B.uploadId,
      }
    });

  } catch (error) {
    console.error("Error fetching class schedule:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  uploadNewProfileImage,
  getAnnouncementsFromSpecificTeacher,
  getStudentProfile,
  addStudentDetails,
  getMonthlyAttendanceStats,
  getClassSchedule
};
