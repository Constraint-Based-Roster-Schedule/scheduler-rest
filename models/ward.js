const mongoose = require('mongoose'); 

const wardSchema = new mongoose.Schema({
    wardNumber : {
        type: Number, 
        required: true
    },
    wardName : {
        type : String, 
        required : true
    }, 
    consultantID : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'Consultant', 
        required : false
    }, 
    doctorList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Doctor", 
            required : false 
        
        }
    ],
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
    
}, {collection : "wards"});

module.exports = mongoose.model ("Ward", wardSchema)