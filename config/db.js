require('dotenv').config()

const mongoose = require('mongoose')
const dbString = process.env.connectionString

mongoose.connect(dbString).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error connecting to MongoDB',err);
    
})


