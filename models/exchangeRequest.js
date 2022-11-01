const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema({
  fromID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' ,
    required: true,
  },
  toID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  currentDate: {
    type: String, 
    required: true
  },
  currentShift: {
    type: Number, 
    required: true
  },
  requestedDate: {
    type: String, 
    required: true
  },
  requestedShift : {
    type : Number, 
    required : true
  },
  requestState: {
    type: Number,
    required: true
  }
}, {
  collection : "exchangeRequests"
});

const exchangeRequest = mongoose.model("exchangeRequest", exchangeRequestSchema);

module.exports = exchangeRequest;