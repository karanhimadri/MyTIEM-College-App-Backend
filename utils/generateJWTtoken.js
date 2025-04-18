const jwt = require("jsonwebtoken");

const generateJWTtoken = (id, role) => {
  const token = jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports = generateJWTtoken;

