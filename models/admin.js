const mongoose=require('mongoose');
const schema=mongoose.Schema;

const adminSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    
    address:{
        type: String,
        required:true,
    },
    emailaddress:{
        type:String,
        required:true,
        unique:true
    },
    telephone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
   
},{collection : "admins"});

module.exports=mongoose.model('Admin',adminSchema);