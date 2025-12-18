//1 import express
const express = require('express')

//4 import controller

const userConroller = require('../controllers/userController')
//2 create router
const router = express.Router()

//3define route

//register user
router.post('/api/register',userConroller.registerUser)

//login user
router.post('/api/login',userConroller.loginUser)

//Googlelogin user
router.post('/api/google-login',userConroller.googleAuth)

//5 export router
module.exports = router