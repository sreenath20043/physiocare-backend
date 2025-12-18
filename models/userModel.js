const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique:true
    },
     password:{
        type:String,
        required:true
    },
     profile:{
        type:String,
        required:false
    },
     role:{
        type:String,
        required:false,
        default:'physiocareUser'
    }
})

module.exports = mongoose.model('Users',userSchema)