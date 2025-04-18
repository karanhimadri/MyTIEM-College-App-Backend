const bcrypt = require("bcryptjs")
const Hod = require("../models/Hod")
const Student = require("../models/Student")
const Teacher = require("../models/Teacher")
const generateJWTtoken = require("../utils/generateJWTtoken.js")
const UploadFile = require("../models/UploadFile.js")


// Register HOD Account
const registerHod = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Invaild Credentials" });
    }

    // Check if HOD already exists
    const exists = await Hod.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "HOD already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create HOD account
    const hod = await Hod.create({
      username,
      password: hashedPassword,
    });

    // Respond with token and user info
    res.status(201).json({
      id: hod._id,
      username: hod.username,
      role: hod.role,
      token: generateJWTtoken(hod._id, "HOD"),
    });
  } catch (error) {
    console.error("Error in registerHod:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login HOD Account
const loginHod = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  try {
    const hod = await Hod.findOne({ username });
    if (!hod) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, hod.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      _id: hod._id,
      username: hod.username,
      role: hod.role,
      token: generateJWTtoken(hod._id, "HOD"),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Creste teacher credentials
const createTeacher = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if username is already taken
    const exists = await Teacher.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create teacher with HOD reference
    const teacher = await Teacher.create({
      username,
      password: hashedPassword,
      hod: req.hod._id, // HOD reference from JWT middleware
    });

    // Add teacher to HOD's teacher list
    req.hod.teachers.push(teacher._id);
    await req.hod.save();

    res.status(201).json({
      message: "Teacher created successfully",
      teacherDetails: teacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Creste student credentials
const createStudent = async (req, res) => {
  try {
    const { username, password, department, semester } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const exists = await Student.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the student
    const student = await Student.create({
      username,
      password: hashedPassword,
      department: department,
      semester: semester,
      hod: req.hod._id,
    });

    // Link student to HOD
    req.hod.students.push(student._id);
    await req.hod.save();

    res.status(201).json({
      message: "Student created successfully",
      studentDetails: student,
    });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// HOD Assign teacher to student
const assignTeacherToStudent = async (req, res) => {
  const { studentUsername, teacherUsername } = req.body;

  if (!studentUsername || !teacherUsername) {
    return res.status(400).json({ message: "Student and Teacher usernames are required." });
  }

  try {
    const student = await Student.findOne({ username: studentUsername });
    const teacher = await Teacher.findOne({ username: teacherUsername });

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    // Check if already assigned
    const studentAlreadyHasTeacher = student.teachers?.includes(teacher._id);
    const teacherAlreadyHasStudent = teacher.students?.includes(student._id);

    if (!studentAlreadyHasTeacher) {
      student.teachers.push(teacher._id);
    }

    if (!teacherAlreadyHasStudent) {
      teacher.students.push(student._id);
    }

    await student.save();
    await teacher.save();

    res.status(200).json({
      message: "Teacher assigned to student successfully.",
      studentId: student._id,
      teacherId: teacher._id
    });

  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ message: "Server error during assignment." });
  }
};

// Create any announcement
const makeAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Announcement message is required.' });
    }

    req.hod.announcements.push({ message });
    await req.hod.save();

    const updatedHod = await Hod.findById(req.hod._id);

    const sortedAnnouncements = [...updatedHod.announcements].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(201).json({
      message: 'Announcement added successfully.',
      announcements: sortedAnnouncements,
    });
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};


// Upload class shedulr for section A & B
const uploadClassSchedule = async (req, res) => {
  try {
    const { semester, section } = req.body;
    if (!semester || !section) {
      return res.status(400).json({ message: 'Semester and section are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { path, filename, originalname, mimetype, size } = req.file;
    const hod = req.hod;

    const upload = await UploadFile.create({
      publicUrl: path,
      filename: filename,
      fileType: "document",
    });

    if (section === "A") {
      hod.classSchedules.section_A = {
        scheduleUrl: path,
        uploadId: upload._id
      };
    } else if (section === "B") {
      hod.classSchedules.section_B = {
        scheduleUrl: path,
        uploadId: upload._id
      };
    } else {
      return res.status(400).json({ message: 'Invalid section. Only A or B allowed.' });
    }

    hod.semester = semester;
    await hod.save();

    return res.status(200).json({
      message: `Class schedule uploaded successfully for Section ${section}`,
      scheduleUrl: path,
      filename: filename,
      originalName: originalname,
      type: mimetype,
      sizeInBytes: size,
    });

  } catch (error) {
    console.error("Upload Schedule Error:", error);
    return res.status(500).json({ message: 'Failed to upload class schedule', error: error.message });
  }
}

module.exports = {
  registerHod,
  loginHod,
  createTeacher,
  createStudent,
  assignTeacherToStudent,
  makeAnnouncement,
  uploadClassSchedule
}

