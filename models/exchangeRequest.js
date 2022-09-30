const mongoose = require("mongoose");

const exchangeRequestSchema = new mongoose.Schema({
  fromID: {
    type: String,
    required: true,
  },
  toID: {
    type: String,
    required: true
  },
  currentDate: {
    type: Number, 
    required: true
  },
  requestedDate: {
    type: Number, 
    required: true
  },
  requestState: {
    type: Number,
    required: true
  }
});

const exchangeRequest = mongoose.model("exchangeRequest", exchangeRequestSchema);

module.exports = exchangeRequest;