const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const generateJWTtoken = require('../utils/generateJWTtoken');

// Teacher Login
const loginTeacher = async (req, res) => {
  const { username, password } = req.body;

  const teacher = await Teacher.findOne({ username });
  if (!teacher) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, teacher.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    _id: teacher._id,
    username: teacher.username,
    role: teacher.role,
    token: generateJWTtoken(teacher._id, "TEACHER"),
  });
};

// Student Login
const loginStudent = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: "Invaild Credentials" });

  const student = await Student.findOne({ username });
  if (!student) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    _id: student._id,
    username: student.username,
    role: student.role,
    token: generateJWTtoken(student._id, "STUDENT"),
  });
};

module.exports = {
  loginTeacher,
  loginStudent,
};
