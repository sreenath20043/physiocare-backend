const Doctors = require('../models/doctorModel')

//docotor register
 exports.registerDoctor = async(req,res)=>{
    console.log("Inside register doctor");
    console.log(req.body);
    console.log(req.file);

    const {username,email,password,number,specialization,experience,location,education,availability,session,fees,date,bio} = req.body

    const profileImage = req.file ? req.file.filename : '';

    const doctorData = {
        username,
        email,
        password,
        number,
        specialization,
        experience,
        location,
        education,
        availability,
        session,
        fees,
        date,
        bio,
        profileImage
    }

    console.log('Doctor data to save:', doctorData);

    try{
        const existingDoctor = await Doctors.findOne({email})
        if(existingDoctor){
            // For testing purposes, allow updating existing doctor
            const updatedDoctor = await Doctors.findOneAndUpdate(
                {email}, 
                doctorData, 
                {new: true}
            )
            res.status(200).json({message:"Doctor updated successfully", doctor: updatedDoctor})
        }else{
            const newDoctor = new Doctors(doctorData)
            await newDoctor.save()
            res.status(201).json({message:"Doctor Registered Successfully",newDoctor})
        }
    }catch(err){
        console.log('Error:', err);
        res.status(500).json({message: "Error registering doctor", error: err.message})
    }
 }

//get all doctors
exports.getAllDoctors = async(req,res)=>{
    try{
        const allDoctors = await Doctors.find()
        res.status(200).json(allDoctors)
    }
    catch(err){
        res.status(500).json({message:'Error fetching doctors',error : err.message});
    }
}



//get doctor profile (requires JWT authentication)
exports.getDoctorProfile = async(req,res)=>{
    try{
        // Get doctor email from JWT token
        const doctorEmail = req.payload

        const doctor = await Doctors.findOne({email: doctorEmail})
        if(doctor){
            res.status(200).json(doctor)
        }else{
            res.status(404).json({message: 'Doctor not found'})
        }
    }
    catch(err){
        res.status(500).json({message:'Error fetching doctor profile',error : err.message});
    }
}

//get doctor by ID (public - anyone can view doctor details)
exports.getDoctorById = async(req,res)=>{
    try{
        const {id} = req.params
        let doctor = await Doctors.findById(id)
        if(!doctor){
            doctor = await Doctors.findOne({email: id})
        }
        if(doctor){
            res.status(200).json(doctor)
        }else{
            res.status(404).json({message: 'Doctor not found'})
        }
    }
    catch(err){
        res.status(500).json({message:'Error fetching doctor details',error : err.message});
    }
}


