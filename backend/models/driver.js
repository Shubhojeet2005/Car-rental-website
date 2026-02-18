const mongoose= require('mongoose');

const driverSchema= new mongoose.Schema({
     firstname:{
        type:String,
        required:True
    },
    lastname:{
        type:String,
        required:True
    },
    Phone:{
        type:Number,
        required:True
    },
    Car_license_no:{
        type:String,
        required:True,
        
    },
    car_name:{
        type:String,
        required:True
    },
    doc_upload:{
        type:String,
        default:''
    },
    password: {
        type: String,
        required: true
    },
})