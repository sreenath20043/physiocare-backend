const Users = require('../models/userModel')
const jwt = require('jsonwebtoken')

// register user - creat - post (username,email,password) request body
exports.registerUser = async(req,res)=>{
    console.log("Inside Register User");
    console.log(req.body);
     const {username,email,password}=req.body; //  destructring
    try{
        // check if user already exits with same email
    const existingUser=await Users.findOne({email})
    //if user exists , send error response 

    if(existingUser){
        res.status(401).json({message:"User already exists whith this email"})

    }else{
        // else create new user
        const newUser = new  Users({username,email,password})
        await newUser.save(); // save to mongodb
        res.status(201).json(newUser)// send created user as response
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
        const existingUser = await Users.findOne({email})
        if(existingUser){
            
        if (existingUser.password==password){
            //token generation
            const token =jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.jwtKey)
            res.status(200).json({message:"Login successful",user:existingUser,token})

        }else{
            res.status(401).json({message:"inavalid password"})
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
            const  token = jwt.sign({userMail:existingUser.email,role:existingUser.role},process.env.jwtKey)
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
        res.status(500).json({message:"Error registering User",error: err.message})
        
    }
    
}