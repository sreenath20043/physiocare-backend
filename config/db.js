require('dotenv').config()

// const mongoose =require('mongoose')
// dbSting = process.env.connectionString
// mongoose.connect(dbSting).then(()=>{
//     console.log('connected to MongoDB');
    
// }).catch((err)=>{
//     console.log('error connecting to mongoDB',err);

const mongoose = require('mongoose')

// Get MongoDB URI from environment variables
const dbString = process.env.MONGODB_URI || process.env.connectionString

// Check if MongoDB URI is provided
if (!dbString) {
  console.error('MongoDB URI is missing! Please set MONGODB_URI environment variable.');
  console.log('Example: MONGODB_URI=mongodb://localhost:27017/physiocare');
  process.exit(1); // Exit the application if no database connection string is provided
}

// Connect to MongoDB with proper error handling
mongoose.connect(dbString).then(() => {
    console.log('Connected to MongoDB successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    console.error('Please check your MONGODB_URI environment variable');
    process.exit(1); // Exit the application if database connection fails
})