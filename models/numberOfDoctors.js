const mongoose = require('mongoose'); 

const NumberOfDoctors = new mongoose.Schema({
    // _id : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "_id",
    //     required : true ,
    // }, 
    wardID : {
        type : mongoose.Schema.Types.ObjectId, 
        required : true
    },
    number : {
        type : Number, 
        required : true
    }
});

module.exports = mongoose.model("NumberOfDoctors", NumberOfDoctors) ;