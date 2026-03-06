//1 import express
const express = require('express')

//4 import controller

const userConroller = require('../controllers/userController')
const doctorController = require('../controllers/doctotController')
const bookingController = require('../controllers/bookingController')
const jwtMiddleware = require('../middlewares/jwtMiddlewares')
const multerMiddleware = require('../middlewares/multerMiddleware')
const adminJwtMiddleware = require('../middlewares/adminJwtMiddleware')
const doctorJwtMiddleware = require('../middlewares/doctorJwtMiddleware')

//2 create router
const router = express.Router()

//3define route

// get all users (patients)
router.get('/api/users', userConroller.getAllUsers);

//register user
router.post('/api/register',userConroller.registerUser)

//login user
router.post('/api/login',userConroller.loginUser)

//Googlelogin user
router.post('/api/google-login',userConroller.googleAuth)

// doctor register 
router.post('/api/doctor-register',multerMiddleware.single('profileImage'),doctorController.registerDoctor)

// get all doctors 
router.get('/api/doctors',doctorController.getAllDoctors)


// get doctor profile 
router.get('/api/doctor/profile',jwtMiddleware,doctorController.getDoctorProfile)

// get doctor by ID 
router.get('/api/doctor/:id',doctorController.getDoctorById)

//doctor booking
router.post('/api/doctor-booking',jwtMiddleware,bookingController.doctorBooking)

//get all doctorbooking
router.get('/api/doctorbooking',jwtMiddleware,bookingController.getAllBooking)

//cancel booking
router.delete('/api/cancel-booking/:bookingId',bookingController.cancelBooking)

// payment
router.post("/api/stripe/create-checkout-session",bookingController.createCheckoutSession);

//update admin
router.put('/api/admin/updateAdmin',adminJwtMiddleware,userConroller.updateAdmin)

// doctor bookings route
router.get("/api/doctor-bookings", doctorJwtMiddleware, bookingController.getDoctorBookings);


//update user
router.put('/api/user/updateUser',jwtMiddleware,userConroller.updateUser)

//5 export router

module.exports = router