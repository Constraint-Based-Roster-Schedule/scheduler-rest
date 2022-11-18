const mongoose = require('mongoose'); 

const advanceRequestSchema = new mongoose.Schema({
    doctorNumber : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Doctor",
        required: true
    },
    wardNumber : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : "Ward",
        required : true
    }, 
    typeID : {
        type : Number, 
        required : false
    }, 
    shifts : {
        type : Array, 
        default : [] 
    },
    shiftMonth : {
        type : String, 
        required : true
    }, 
    shiftYear : {
        type : String, 
        required : true
    }
}, {collection : "advanceRequests"});

module.exports = mongoose.model ("advanceRequests", advanceRequestSchema)