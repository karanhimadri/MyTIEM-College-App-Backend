const jwt = require("jsonwebtoken");
const Student = require("../models/Student")
require("dotenv").config()

const studentMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const student = await Student.findById(decoded.id);

      if (!student) return res.status(401).json({ message: "Student not found" });

      req.student = student; // ✅ Pass to route
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = studentMiddleware;
