const mongoose = require('mongoose'); 

const wardSchema = new mongoose.Schema({
    wardNumber : {
        type: Number, 
        required: true
    },
    wardName : {
        type : Number, 
        required : true
    }, 
    consultantID : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User', 
        required : true
    }, 
    doctorList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User", 
            required : false 
        
        }
    ]
    
});

module.exports = mongoose.model ("Ward", wardSchema)