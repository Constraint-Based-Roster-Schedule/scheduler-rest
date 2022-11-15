const mongoose = require('mongoose'); 

const advanceRequestSchema = new mongoose.Schema({
    doctorNumber : {
        type: Number, 
       
        required: true
    },
    wardNumber : {
        type : Number, 
        required : true
    }, 
    // 
    typeID : {
        type : Number, 
        required : true
    }, 
    shift : {
        type : Number,
       required:true
    },
    shiftDay : {
        type : Number,
        required : true
    },
    shiftMonth:{
        type:Number,
        required:true
    }
    
    
    
}, {collection : "advanceRequests"});

module.exports = mongoose.model ("advanceRequests", advanceRequestSchema)