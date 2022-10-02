const mongoose = require('mongoose');

const rosterSchema = new mongoose.Schema({
    wardID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ward",
        required : true ,
    }, 
    month : {
        type : String, 
        required : true
    },
    days : {
        type : Array,
        default : []
    }
});

module.exports = mongoose.model("Roster", rosterSchema) ;