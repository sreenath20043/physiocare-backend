require('dotenv').config()
const mongoose =require('mongoose')


dbSting = process.env.connectionString

mongoose.connect(dbSting).then(()=>{
    console.log('coonected to MongoDB');
    
}).catch((err)=>{
    console.log('error connecting to mongoDB',err);
    
})