const mongoose = require('mongoose'); 

const advanceRequestSchema = new mongoose.Schema({
    doctorID : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor",
        required: true
    },
    wardID : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "Ward",
        required : true
    }, 
    typeID : {
        type : Number, 
        required : false
    }, 
    shift : {
        day : Number,
        shiftNum : Number
    },
    shiftDay : {
        type : Number,
        required : true
    }
    
    
    
}, {collection : "advanceRequests"});

module.exports = mongoose.model ("advanceRequests", advanceRequestSchema)