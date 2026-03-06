const mongoose = require('mongoose')

const bookinSchema = new mongoose.Schema({

     doctorId: {   
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctors',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  
     username:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique:false
    },
     number:{
        type:String,
        required:true,
        unique:false
    },
     session:{
        type:String,
        required:false,
    },
     date:{
        type:String,
        required:false
    },
     time:{
        type:String,
        required:true
    },
     description:{
        type:String,
        required:false
    },
     status:{
        type:String,
        default:'Pending'
    },
    role:{
        type:String,
        required:false,
        default:'physiocareBooking'
    }
})

module.exports = mongoose.model('booking',bookinSchema)