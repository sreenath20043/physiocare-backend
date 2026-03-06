//1 import express
const express = require('express')
//6 import db connection
const db = require('./config/db')

//7 import cros
const cors = require('cors')

//8 import routes
const router = require('./router/route')
// const appMiddleware = require('./middlewares/appMiddleware')

//2 app creation
const physiocareServer = express()

//9 use cors
physiocareServer.use(cors())

//10 use json middleware
physiocareServer.use(express.json())

//12implementin middlewares
// physiocareServer.use(appMiddleware)

//11use route
physiocareServer.use(router)

//multer
physiocareServer.use('/uploads',express.static('./uploads'))

//3 poert define
const PORT = 3000;

//4 server start
physiocareServer.listen(PORT,()=>{
    console.log(`Physiocare server started on port ${PORT}`);
    
})