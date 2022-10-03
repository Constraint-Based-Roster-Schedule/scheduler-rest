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
    shiftsPerDay : {
        type : Number,
        required : true
    },
    shiftNames : [
        {
            type : String,
            required : true
        }
    ]
    
}, {collection : "advanceRequests"});

module.exports = mongoose.model ("advanceRequests", advanceRequestSchema)