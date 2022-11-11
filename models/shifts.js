const mongoose = require('mongoose'); 

const shifts = new mongoose.Schema({
    _id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "_id",
        required : true ,
    }, 
    month : {
        type : String, 
        required : true
    },
    year : {
        type : String, 
        required : true
    },
    shifts : {
        type : Array,
        default : []
    }
});

module.exports = mongoose.model("shifts", shifts) ;