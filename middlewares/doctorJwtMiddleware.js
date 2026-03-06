const jwt = require("jsonwebtoken");

const doctorJwtMiddleware = async (req, res, next) => {
  console.log("Inside doctorJwtMiddleware");

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Doctor token missing"
      });
    }

    const token = authHeader.split(" ")[1];
    console.log("Doctor Token:", token);

    const decoded = jwt.verify(token, process.env.jwtKey);
    console.log("Decoded Doctor JWT:", decoded);

    // Make sure this token belongs to doctor
    if (decoded.role !== "physiocareDoctor") {
      return res.status(403).json({
        message: "Access denied. Not a doctor."
      });
    }

    // Find doctor in database to get proper doctorId
    const Doctors = require('../models/doctorModel');
    const doctor = await Doctors.findOne({ email: decoded.usermail || decoded.userMail });
    
    if (!doctor) {
      return res.status(401).json({
        message: "Doctor not found in database"
      });
    }

    req.doctorId = doctor._id;
    req.doctorEmail = doctor.email;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Doctor authentication error",
      error: error.message
    });
  }
};

module.exports = doctorJwtMiddleware;