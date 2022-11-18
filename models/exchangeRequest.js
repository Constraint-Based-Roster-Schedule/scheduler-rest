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
    type: Number, 
    required: true
  },
  currentShift: {
    type: Number, 
    required: true
  },
  requestedDate: {
    type: Number, 
    required: true
  },
  requestedShift : {
    type : Number, 
    required : true
  },
  requestState: {
    type: Number,
    required: true
  },
  month: {
    type: String, 
    required: true
  },
  year: {
    type: String, 
    required: true
  },
}, {
  collection : "exchangeRequests"
});

const exchangeRequest = mongoose.model("exchangeRequest", exchangeRequestSchema);

module.exports = exchangeRequest;