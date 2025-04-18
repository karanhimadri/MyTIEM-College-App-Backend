const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher")
require("dotenv").config()

const teacherMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const teacher = await Teacher.findById(decoded.id);

      if (!teacher) return res.status(401).json({ message: "Teacher not found" });

      req.teacher = teacher; // ✅ Pass to route
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = teacherMiddleware;
