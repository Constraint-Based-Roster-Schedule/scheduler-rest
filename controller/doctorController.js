const Doctor = require("../models/doctor");
const express = require("express");
const exchangeRequestModel = require("../models/exchangeRequest")
const rosterSchema=require('../models/rosterSchema');
const shifts =require("../models/shifts")
const mongoose = require("mongoose");

const http = require('http');
const url = require('url');
const { response } = require("express");
const { start } = require("repl");


const Ward=require('../models/ward')


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
    var fromID="633b8d8c6519cbf196d8e5a1";
    req.body.fromID=fromID;
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
  const year=req.query.year;
  
  function getMonthFromString(mon){
   return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
  }

  const int_month=getMonthFromString(month)-1;

  const shiftNames_abstratct=await shifts.find({month:month,year:year},null,{limit:1});
  const shiftNames=shiftNames_abstratct[0].shifts;
  console.log(shiftNames);

  const myShifts_abstract=await rosterSchema.find({month:month},null,{limit:1});
  const myShifts=myShifts_abstract[0].days;
  console.log(myShifts);
  return res.status(200).json({"shiftNames":shiftNames,"myShifts":myShifts});
}

const getShiftNames=async(req,res)=>{
  const month=req.query.month;
  const year=req.query.year;
  const shiftNames_abstratct=await shifts.find({month:month,year:year},null,{limit:1});
  const shiftNames=shiftNames_abstratct[0].shifts;
  console.log(shiftNames);
  return res.status(200).json({"shiftNames":shiftNames});
}

const getUserDetails = async (req, res) => {
  const userId = req.userID;
  console.log(userId);
  const userType = req.body.type;
  console.log(req.body);
  
  let userDetails = null;
  let wardDetails = null;
 

  if (userType === "1") {
    userDetails = await Doctor.findOne({ id: userId });
    if (!userDetails) {
      console.log("doctor not found");
      return res.status(500).json({
        success: false,
        msg: "errroorrrrrrrrrr",
      });
    } else {
      console.log(userDetails);
      wardDetails = await Ward.findOne({ id: userDetails.wardID });
      console.log(wardDetails);
      console.log(wardDetails.wardNumber);
      return res.status(200).json({
        success: true,
        msg: "get doctor profile details correctly",
        fullName: userDetails.firstName + " " + userDetails.lastName,
        email: userDetails.emailaddress,
        address: userDetails.address,
        telephone: userDetails.telephone,
        emailaddress: userDetails.emailaddress,
        userName: userDetails.userName,
        wardName: wardDetails.wardName,
        wardID: wardDetails.wardNumber,
      });
      // res.send(userDetails);
    }
  }

};


module.exports = {
  getUser,getData,submitLeaveRequest,submitPreferrableSlots,getIndividualRoster,getShiftNames, getInNotif, putNotif, getOutNotif, hideNotif, declineRequest, acceptRequest,getUserDetails
};
