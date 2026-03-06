const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
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
     number:{
        type:String,
        required:true,
        unique:true
    },
     specialization:{
        type:String,
        required:true
      
    },
     experience:{
        type:String,
        required:true,
        
    },
     location:{
        type:String,
        required:true
    },
     education:{
        type:String,
        required:true
        
    },
     availability:{
        type:String,
        required:false,
        default: 'Mon-Fri: 9AM-6PM'
    },
     session:{
        type:String,
        required:false,
        default: 'In Person, Online'
    },
     fees:{
        type:Number,
        required:false,
        default: 100
    },
     profileImage:{
        type:String,
        required:false,
        default:''
    },
     bio:{
        type:String,
        required:false
    }
    ,
     date:{
        type:String,
        required:false
    },
     role:{
        type:String,
        required:false,
        default:'physiocareDoctor'
    }
})

module.exports = mongoose.model('doctors',doctorSchema)