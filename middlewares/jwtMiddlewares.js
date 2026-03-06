 

const jwt = require('jsonwebtoken')

const jwtMiddleware = async(req,res,next)=>{
  console.log("Inside JWT Middleware");
  
  if (!req.headers.authorization) {
    return res.status(401).json("Authorization header missing");
  }
  
  const authHeader = req.headers.authorization;
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json("Invalid authorization format");
  }
  
  const token = authHeader.slice(7); 
  console.log("Token:", token);
  
 try {
  const jwtVerification = jwt.verify(token,process.env.jwtKey)
  console.log("JWT Verification:", jwtVerification);

  req.userId =  jwtVerification.userId
  
  const userEmail = jwtVerification.usermail || jwtVerification.userMail;
  console.log("User email from token:", userEmail);
  
  if (!userEmail) {
    console.log("No email found in JWT token");
    return res.status(401).json("Invalid token structure");
  }
  
  const Users = require('../models/userModel');
  console.log("Looking for user with email:", userEmail);
  const user = await Users.findOne({ email: userEmail });
  console.log("Found user:", user);
  
  if (!user) {
    console.log("User not found in database");
    return res.status(401).json("User not found");
  }
  
  req.payload = userEmail
  req.userId = user._id  
  console.log("Set userId:", req.userId);
  next()
 } catch (err) {
  console.log("JWT Error:", err);
  res.status(401).json("Authentication Error: " + err.message)
 }
}
module.exports = jwtMiddleware