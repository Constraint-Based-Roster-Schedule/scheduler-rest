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
=======

const getData=(req,res)=>{
    const wardDoctors=[[1,'Thinira Wanasingha'],[2,'Sakuni Bandara'], [3,'Gamunu Bandara'], [4,'Harshani Bandara']];
    const myShifts={
        "1":[0,1],
        "2":[1],
        "3":[0,1],
        "4":[2],
        "5":[1],
        "6":[1,2],
        "7":[0,1],
        "8":[0,1],
        "9":[1],
        "10":[2],
        "11":[1,2],
        "12":[0,1],
        "13":[2],
        "14":[1],
        "15":[1,2]
    };
    
    return res.status(200).json({"wardDoctors":wardDoctors,"myShifts":myShifts});
}


const submitLeaveRequest=(req,res)=>{
  if(!req.body){
    return res.status(201).json({success:false,msg:"can't have an empty body"})
  }else{
    console.log(req.body);
    return res.send(req.body);
  }
  
}

const submitPreferrableSlots=(req,res)=>{
  console.log(req.body);
  return res.send(req.body);
}

const getIndividualRoster=(req,res)=>{
  const myShifts={
        "1":[0,1,0],
        "2":[1,0,0],
        "3":[0,1,1],
        "4":[1,1,0],
        "5":[1,0,1],
        "6":[1,1,0],
        "7":[0,1,0],
        "8":[0,1,1],
        "9":[1,1,0],
        "10":[0,1,1],
        "11":[1,0,0],
        "12":[1,1,0],
        "13":[0,1,1],
        "14":[0,1,0],
        "15":[1,0,1],
        "16":[1,1,0],
        "17":[0,1,1],
        "18":[1,0,0],
        "19":[1,1,0],
        "20":[1,0,1],
        "21":[0,1,1],
        "22":[0,1,1],
        "23":[0,0,0],
        "24":[0,1,0],
        "25":[1,0,0],
        "26":[0,1,1],
        "27":[1,0,1],
        "28":[0,1,1],
        "29":[0,1,1],
        "30":[0,1,0],
        "31":[1,0,1],
    };
    
  return res.status(200).json({"myShifts":myShifts});
}

const getShiftNames=(req,res)=>{
  const shiftNames={
    '1':"Morning Shift",
    "2":"Evening Shift",
    "3":"Night Shift",
  }
  return res.status(200).json({"shiftNames":shiftNames});
}

module.exports = {
  getUser,getData,submitLeaveRequest,submitPreferrableSlots,getIndividualRoster,getShiftNames, getInNotif, putNotif, getOutNotif, hideNotif, declineRequest, acceptRequest
};
