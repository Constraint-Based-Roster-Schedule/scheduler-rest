const Doctor = require("../models/doctor");
const express = require("express");
const exchangeRequestModel = require("../models/exchangeRequest")
const mongoose = require("mongoose");


const getUser = async (req, res) => {
  const doctorList = await Doctor.find();
  if (!doctorList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(doctorList);
};

const getInNotif = async (req, res) => {
  
  var recievedByID = req.userID ;
  console.log(recievedByID);
  try {
    var docs = await exchangeRequestModel.find({toID : recievedByID}) ;
  docs.forEach(element => {
    console.log(element);
    
  });
  return res.status(200).json(docs)   
  } catch (error) {
    return console.error(error)
  }
  

}
const putNotif = async (req, res, next) => {
  if (!req.body) {
    return res.status(201).json({success: false, msg: "can't have empty body"}) ;
  } else {
    var request1 = new exchangeRequestModel(req.body) ;
    request1.save(function (err, request1) {
      if (err) return console.error(err);
      console.log(request1._id + " saved to exchangeRequests collection.");
      return res.status(200).json({success: true, msg: "added successfully"}) ;
    });

    
  }
   ;

}
const getOutNotif = async(req,res) => {

}
const hideNotif = async (req,res) => {

}
const declineRequest = async (req,res) => {

}
const acceptRequest = async (req,res) => {

}
module.exports = {
  getUser, getInNotif, putNotif, getOutNotif, hideNotif, declineRequest, acceptRequest
};
