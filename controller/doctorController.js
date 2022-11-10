const Doctor = require("../models/doctor");
const express = require("express");
const exchangeRequestModel = require("../models/exchangeRequest")
const rosterSchema=require('../models/rosterSchema');
const mongoose = require("mongoose");
const http = require('http');
const url = require('url');
const { response } = require("express");
const { start } = require("repl");


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

const getIndividualRoster=async(req,res)=>{

  const month=req.query.month;
  
  function getMonthFromString(mon){
   return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
  }

  const int_month=getMonthFromString(month)-1;

  const shiftNames=[
    ["Morning Shift","#33ccff"],
    ["Evening Shift","#F58B44"],
    ["Night Shift","#66ff66"],
    ]
  

  const myShifts_abstract=await rosterSchema.find({month:month},null,{limit:1});
  const myShifts=myShifts_abstract[0].days;
  console.log(myShifts);
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
