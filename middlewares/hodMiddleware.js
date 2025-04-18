const jwt = require("jsonwebtoken");
const Hod = require("../models/Hod");
require("dotenv").config()

const protectHOD = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hod = await Hod.findById(decoded.id);

      if (!hod) return res.status(401).json({ message: "HOD not found" });

      req.hod = hod; // ✅ Pass to route
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protectHOD;
