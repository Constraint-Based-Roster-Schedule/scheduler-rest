const mongoose=require('mongoose');
const schema=mongoose.Schema;

const consultantSchema=new mongoose.Schema({
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
    wardID:{
        type:mongoose.Schema.Types.ObjectId,
        ref : "Ward" ,
        required:true
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
    speciality:{
        type:String,
        required:true
    }
}, {collection : "consultants"});

module.exports=mongoose.model('Consultant',consultantSchema);