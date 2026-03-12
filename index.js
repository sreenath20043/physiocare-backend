//1 import express
const express = require('express')

//6 import db connection
require('./config/db')

//7 import cors
const cors = require('cors')

//8 import routes
const router = require('./router/route')

//2 app creation
const physiocareServer = express()

//9 use cors
physiocareServer.use(cors())

//10 use json middleware
physiocareServer.use(express.json())

//11use route
physiocareServer.use(router)

//multer
physiocareServer.use('/uploads',express.static('./uploads'))

//3 port define
const PORT = process.env.PORT || 3000

//4 server start
physiocareServer.listen(PORT,()=>{
    console.log(`Physiocare server started on port ${PORT}`)
})