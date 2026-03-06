// Get all physiocare users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.find({ role: 'physiocareUser' });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
const Users = require('../models/userModel')
const Doctors = require('../models/doctorModel')
const jwt = require('jsonwebtoken')

// register user 
exports.registerUser = async(req,res)=>{
    console.log("Inside Register User");
    console.log(req.body);
     const {username,email,password}=req.body; //  destructring
    try{
      
    const existingUser=await Users.findOne({email})

    if(existingUser){
        res.status(401).json({message:"User already exists whith this email"})

    }else{
        const newUser = new  Users({username,email,password})
        await newUser.save(); // save to mongodb
        res.status(201).json(newUser)
    }
    
    }
    catch(err){
        res.status(500).json({message:'Error registering',error : err.message});
    }
    res.send("User register succefully")
}

// login
exports.loginUser = async(req,res)=>{
    console.log('Inside Login User');
    console.log(req.body);
    const{email,password}=req.body
    try {

        let existingUser = await Users.findOne({email})
        
        if(!existingUser){
            existingUser = await Doctors.findOne({email})
        }
        
        if(existingUser){
            
        if (existingUser.password==password){
            //token generation
            const token =jwt.sign({userMail:existingUser.email,role:existingUser.role, user:existingUser._id},process.env.jwtKey)
            res.status(200).json({message:"Login successful",user:existingUser,token})
    res.json({userID});
        
        }else{
            res.status(401).json({message:"invalid password"})
        }
        }else{
           res.status(401).json({message:"User not found"})

        }
    } catch (err) {
        res.status(500).json({message:"Error Login user",error:err.message})
    }
    
    
}

// google login
exports.googleAuth = async (req,res)=>{
    console.log("inside google Login user");
    const {email,password,username,profile}= req.body

    try {
        const  existingUser = await Users.findOne({email});
        if(existingUser){
            // token genaration 
            const  token = jwt.sign({userMail:existingUser.email,role:existingUser.role,user:existingUser._id},process.env.jwtKey)
            console.log(token);
            res.status(200).json({message : "Login Sucecessful",user:existingUser,token})
            
        }else{
            // else create  new user
            const newUser = new Users({email,password,username,profile});
            await newUser.save(); // save to  database 
            // token genaration
            const  token = jwt.sign({userMail:newUser.email,role:newUser.role},process.env.jwtKey)
            console.log(token);
            res.status(201).json({message:"login sucecessful",user:newUser,token});// second created user as response
            
        }
    } catch (error) {
        res.status(500).json({message:"Error registering User",error: error.message})
        
    }
    
}

// update admin
exports.updateAdmin = async (req,res)=>{
    console.log(req.body);
const { username,email, password ,role} = req.body;

  try {
    const adminData = await Users.findOneAndUpdate(
      { email },
      { username, email, password, role });

    await adminData.save();
    res.status(200).json({ message: "Admin Details Updated...", adminData });
    
  } catch (err) {
    res.status(500).json({ message: "Error in updataion"});
  }    
}

// update user
exports.updateUser = async (req,res)=>{
    console.log(req.body);
const { username,email, password ,profile} = req.body;

  try {
    // Find user by email and update
    const userData = await Users.findOneAndUpdate(
      { email },
      { username, email, password, profile },
      { new: true, runValidators: true }
    );

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User Details Updated...", userData });
    
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error in update", error: err.message });
  }    
}