const Doctor = require("../models/doctor");
const express = require("express");
const exchangeRequestModel = require("../models/exchangeRequest")
const rosterSchema=require('../models/rosterSchema');
const advanceRequests=require('../models/advanceRequest');
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
    // var fromID="633b8d8c6519cbf196d8e5a1";
    // req.body.fromID=fromID;
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
  const docID=req.query.docID;
  const month=req.query.month;
  const year=req.query.year;
  const date=req.query.date;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(docID);
  //console.log(date);

  const rec_notifications=await exchangeRequestModel.find({toID:id,requestState:1,month:month,year:year},null,{});
  const sending_recNot=[]
  for(const notif of rec_notifications){
    //const int_requestDate=+notif.requestedDate;
    if(notif.requestedDate>date){
      if(notif.currentDate>date){
        var id1 = mongoose.Types.ObjectId(notif.fromID.toString());
        const doc_det=await Doctor.find({_id:id1},null,{limit:1});
        sending_recNot.push({"id":notif._id.toString(),"date":notif.currentDate, "workingslot":notif.currentShift,"datewith":notif.requestedDate,"shiftwith":notif.requestedShift,"doctorID":notif.fromID.toString(),"doctorName":doc_det[0].firstName,"state":notif.requestState})
      }      
    }
  }
  //console.log(sending_recNot);

  const accepted_notifications=await exchangeRequestModel.find({fromID:id,requestState:2,month:month,year:year},null,{});
  const sentNotifications=[];
  for(const notif of accepted_notifications){
    //const int_requestDate=+notif.requestedDate;
    if(notif.requestedDate>date){
      if(notif.currentDate>date){
        var id1 = mongoose.Types.ObjectId(notif.toID.toString());
        const doc_det=await Doctor.find({_id:id1},null,{limit:1});
        sentNotifications.push({"id":notif._id.toString(),"date":notif.currentDate, "workingslot":notif.currentShift,"datewith":notif.requestedDate,"shiftwith":notif.requestedShift,"doctorID":notif.toID.toString(),"doctorName":doc_det[0].firstName,"state":notif.requestState})
      }      
    }
  }

  const declined_notifications=await exchangeRequestModel.find({fromID:id,requestState:3,month:month,year:year},null,{});
  for(const notif of declined_notifications){
    //const int_requestDate=+notif.requestedDate;
    if(notif.requestedDate>date){
      if(notif.currentDate>date){
        var id1 = mongoose.Types.ObjectId(notif.toID.toString());
        const doc_det=await Doctor.find({_id:id1},null,{limit:1});
        sentNotifications.push({"id":notif._id.toString(),"date":notif.currentDate, "workingslot":notif.currentShift,"datewith":notif.requestedDate,"shiftwith":notif.requestedShift,"doctorID":notif.toID.toString(),"doctorName":doc_det[0].firstName,"state":notif.requestState})
      }      
    }
  }
  //console.log(sentNotifications);

  return res.status(200).json({"received":sending_recNot,"sent":sentNotifications});

}
const hideNotif = async (req,res) => {

}
const declineRequest = async (req,res) => {
  const not_id=req.query.notifID;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(not_id);

  const filter = { _id: id };
  const update = { requestState: 3 };
  let doc = await exchangeRequestModel.findOneAndUpdate(filter, update, {new: true});
  return res.status(200).json({success: true, msg: "added successfully"}) ;
}


const acceptRequest = async (req,res) => {
  const not_id=req.query.notifID;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(not_id);

  const filter = { _id: id };
  const update = { requestState: 2 };
  let doc = await exchangeRequestModel.findOneAndUpdate(filter, update, {new: true});
  return res.status(200).json({success: true, msg: "added successfully"}) ;
}

const closeNotification=async(req,res)=>{
  const not_id=req.query.notifID;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(not_id);

  const filter = { _id: id };
  const update = { requestState: 4 };
  let doc = await exchangeRequestModel.findOneAndUpdate(filter, update, {new: true});
  return res.status(200).json({success: true, msg: "added successfully"}) ;
}


const getData=async(req,res)=>{
  const month=req.query.month;
  const year=req.query.year;
  const wardID=req.query.wardID;
  const intID=req.query.intID;
  const wardId_string=wardID.toString();
  //console.log(wardId_string)
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardId_string);
  const wardRoster_abstract=await rosterSchema.find({month:month,year:year,wardID:id},null,{limit:1})
  //console.log(id);
  const wardRoster=wardRoster_abstract[0].days;

  let myShifts=[]
  for(const day of wardRoster){
    let dayShifts=[]
    let shift_num=0;
    for(const shift of day){
      if(shift.includes(intID.toString())){
        dayShifts.push(shift_num)
      }
      shift_num+=1;
    }
    myShifts.push(dayShifts)   
  }
  //console.log(myShifts);
  
  return res.status(200).json({"myShifts":myShifts});
}


const submitLeaveRequest=(req,res)=>{
  const leaves=req.query.leaveRequests;
  const month=req.query.month;
  const year=req.query.year;
  const docID=req.query.docID;
  const wardID=req.query.wardID;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(docID);
  var ward_id=mongoose.Types.ObjectId(wardID);
  const saving_data={"doctorNumber":id,"wardNumber":ward_id,"typeID":2,"shiftMonth":month,"shiftYear":year,"shifts":leaves}
  console.log(saving_data);
  var request1 = new advanceRequests(saving_data) ;
  request1.save(function (err, request1) {
    if (err) return console.error(err);
    console.log(request1._id + " saved to exchangeRequests collection.");
    return res.status(200).json({success: true, msg: "added successfully"}) ;
  });
  //console.log(leaves)
  
}

const submitPreferrableSlots=(req,res)=>{
  const leaves=req.query.prefferableSlots;
  const month=req.query.month;
  const year=req.query.year;
  const docID=req.query.docID;
  const wardID=req.query.wardID;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(docID);
  var ward_id=mongoose.Types.ObjectId(wardID);
  const saving_data={"doctorNumber":id,"wardNumber":ward_id,"typeID":1,"shiftMonth":month,"shiftYear":year,"shifts":leaves}
  console.log(saving_data);
  var request1 = new advanceRequests(saving_data) ;
  request1.save(function (err, request1) {
    if (err) return console.error(err);
    console.log(request1._id + " saved to exchangeRequests collection.");
    return res.status(200).json({success: true, msg: "added successfully"}) ;
  });
}

const getIndividualRoster=async(req,res)=>{

  const month=req.query.month;
  const year=req.query.year;
  const months=req.query.months;
  // const wardID=req.query.wardID;
  // const wardId_string=wardID.toString()
  // const myID=req.query.myID
  //console.log(months);
  // var mongoose = require('mongoose');
  // var id = mongoose.Types.ObjectId(wardId_string);
  function getMonthFromString(mon){
   return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
  }

  const int_month=getMonthFromString(month)-1;

  const shiftNames_abstratct=await shifts.find({month:month,year:year},null,{limit:1});
  const shiftNames=shiftNames_abstratct[0].shifts;
  //console.log(shiftNames);

  
  const myShifts_abstract=[]
  const myShifts_abstract0=await rosterSchema.find({month:months[0]},null,{limit:1});
  myShifts_abstract.push(myShifts_abstract0[0].days)
  const myShifts_abstract1=await rosterSchema.find({month:months[1]},null,{limit:1});
  myShifts_abstract.push(myShifts_abstract1[0].days)
  const myShifts_abstract2=await rosterSchema.find({month:months[2]},null,{limit:1});
  myShifts_abstract.push(myShifts_abstract2[0].days)
  const myShifts_abstract3=await rosterSchema.find({month:months[3]},null,{limit:1});
  myShifts_abstract.push(myShifts_abstract3[0].days)
  
  //const myShifts=myShifts_abstract[0].days;
  //console.log(myShifts_abstract);
  // console.log(myShifts);
  return res.status(200).json({"shiftNames":shiftNames,"myShifts":myShifts_abstract});
}

const getWardDoctors=async(req,res)=>{
  const wardID=req.query.wardID;
  const wardId_string=wardID.toString();
  //console.log(wardId_string)
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardId_string);
  const ward_doctors=await Doctor.find({wardID:wardID},null,{});
  const doctorDetails=[]
  for(const doc of ward_doctors){
    const id_string=doc._id.toString();
    doctorDetails.push([doc.docID,doc.firstName,doc.lastName,id_string])
  }
  //console.log(doctorDetails)
  return res.status(200).json({"doctorDetails":doctorDetails});
}


const getShiftNames=async(req,res)=>{
  const month=req.query.month;
  const year=req.query.year;
  const shiftNames_abstratct=await shifts.find({month:month,year:year},null,{limit:1});
  const shiftNames=shiftNames_abstratct[0].shifts;
  //console.log(shiftNames);
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
  getUser,getData,submitLeaveRequest,submitPreferrableSlots,getIndividualRoster,getShiftNames, getInNotif, putNotif, getOutNotif, hideNotif, declineRequest, acceptRequest,getUserDetails,getWardDoctors,closeNotification
};
