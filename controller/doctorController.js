const Doctor = require("../models/doctor");
const express = require("express");
const exchangeRequestModel = require("../models/exchangeRequest");
const rosterSchema = require("../models/rosterSchema");
const advanceRequests = require("../models/advanceRequest");
const shifts = require("../models/shifts");
const mongoose = require("mongoose");

const http = require("http");
const url = require("url");
const { response } = require("express");
const { start } = require("repl");
const bcrypt = require("bcrypt");

const Ward = require("../models/ward");

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
  var recievedByID = req.userID;

  console.log(recievedByID);
  try {
    var docs = await exchangeRequestModel.find({ toID: recievedByID });
    docs.forEach((element) => {
      console.log(element);
    });
    return res.status(200).json(docs);
  } catch (error) {
    return console.error(error);
  }
};
const putNotif = async (req, res, next) => {
  if (!req.body) {
    return res
      .status(201)
      .json({ success: false, msg: "can't have empty body" });
  } else {

    console.log(req.query)
    var request1 = new exchangeRequestModel(req.body) ;


    request1.save(function (err, request1) {
      if (err) return console.error(err);
      console.log(request1._id + " saved to exchangeRequests collection.");
      return res.status(200).json({ success: true, msg: "added successfully" });
    });
  }
};
const getOutNotif = async (req, res) => {
  //console.log("kasjhd")
  const docID = req.query.docID;
  const month = req.query.month;
  const year = req.query.year;
  const date = req.query.date;
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId(docID);
  //console.log(docID)
  const rec_notifications=await exchangeRequestModel.find({toID:id,requestState:1,month:month,year:year},null,{});
  console.log(rec_notifications)
  const sending_recNot=[]
  for(const notif of rec_notifications){
    //const int_requestDate=+notif.requestedDate;
    if(notif.requestedDate>date){
      if(notif.currentDate>date){
        var id1 = mongoose.Types.ObjectId(notif.fromID.toString());
        const doc_det = await Doctor.find({ _id: id1 }, null, { limit: 1 });
        sending_recNot.push({
          id: notif._id.toString(),
          date: notif.currentDate,
          workingslot: notif.currentShift,
          datewith: notif.requestedDate,
          shiftwith: notif.requestedShift,
          doctorID: notif.fromID.toString(),
          doctorName: doc_det[0].firstName,
          state: notif.requestState,
        });
      }
    }
  }
  console.log(sending_recNot)
  const accepted_notifications=await exchangeRequestModel.find({fromID:id,requestState:2,month:month,year:year},null,{});
  const sentNotifications=[];
  for(const notif of accepted_notifications){
    //const int_requestDate=+notif.requestedDate;
    if(notif.requestedDate>date){
      if(notif.currentDate>date){
        var id1 = mongoose.Types.ObjectId(notif.toID.toString());
        const doc_det = await Doctor.find({ _id: id1 }, null, { limit: 1 });
        sentNotifications.push({
          id: notif._id.toString(),
          date: notif.currentDate,
          workingslot: notif.currentShift,
          datewith: notif.requestedDate,
          shiftwith: notif.requestedShift,
          doctorID: notif.toID.toString(),
          doctorName: doc_det[0].firstName,
          state: notif.requestState,
        });
      }
    }
  }

  const declined_notifications=await exchangeRequestModel.find({fromID:id,requestState:3,month:month,year:year},null,{});
  for(const notif of declined_notifications){
    //const int_requestDate=+notif.requestedDate;
    if(notif.requestedDate>date){
      if(notif.currentDate>date){
        var id1 = mongoose.Types.ObjectId(notif.toID.toString());
        const doc_det = await Doctor.find({ _id: id1 }, null, { limit: 1 });
        sentNotifications.push({
          id: notif._id.toString(),
          date: notif.currentDate,
          workingslot: notif.currentShift,
          datewith: notif.requestedDate,
          shiftwith: notif.requestedShift,
          doctorID: notif.toID.toString(),
          doctorName: doc_det[0].firstName,
          state: notif.requestState,
        });
      }
    }
  }


  return res
    .status(200)
    .json({ received: sending_recNot, sent: sentNotifications });
};
const hideNotif = async (req, res) => {};
const declineRequest = async (req, res) => {
  const not_id = req.query.notifID;
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId(not_id);

  const filter = { _id: id };
  const update = { requestState: 3 };
  let doc = await exchangeRequestModel.findOneAndUpdate(filter, update, {
    new: true,
  });
  return res.status(200).json({ success: true, msg: "added successfully" });
};

const acceptRequest = async (req, res) => {
  const not_id = req.query.notifID;
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId(not_id);

  const filter = { _id: id };
  const update = { requestState: 2 };
  let doc = await exchangeRequestModel.findOneAndUpdate(filter, update, {
    new: true,
  });
  return res.status(200).json({ success: true, msg: "added successfully" });
};

const closeNotification = async (req, res) => {
  const not_id = req.query.notifID;
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId(not_id);

  const filter = { _id: id };
  const update = { requestState: 4 };
  let doc = await exchangeRequestModel.findOneAndUpdate(filter, update, {
    new: true,
  });
  return res.status(200).json({ success: true, msg: "added successfully" });
};


const getData=async(req,res)=>{
  const month=req.query.month;
  const year=req.query.year;
  const wardID=req.query.wardID;
  const intID=req.query.intID;
  const wardId_string=wardID.toString();
  //console.log(wardId_string)
  //console.log(intID)
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardId_string);
  const wardRoster_abstract=await rosterSchema.find({month:month,year:year,wardID:id},null,{limit:1})
  //console.log(id);
  let wardRoster=[]
  if(wardRoster_abstract.length>0){
    wardRoster=wardRoster_abstract[0].days;
  }

  console.log(wardRoster)
  let myShifts = [];
  for (const day of wardRoster) {
    //console.log(day)
    let dayShifts = [];
    let shift_num = 0;
    for (const shift of day) {
      //console.log(shift)
      if (shift.includes(+intID)) {
        dayShifts.push(shift_num);
      }
      shift_num += 1;
    }
    myShifts.push(dayShifts);
  }
  console.log(myShifts);
  
  return res.status(200).json({"myShifts":myShifts,"wardShifts":wardRoster});
}

const submitLeaveRequest = (req, res) => {
  const leaves = req.query.leaveRequests;
  const month = req.query.month;
  const year = req.query.year;
  const docID = req.query.docID;
  const wardID = req.query.wardID;
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId(docID);

  var ward_id=mongoose.Types.ObjectId(wardID);

  const saving_data={"doctorNumber":id,"wardNumber":ward_id,"typeID":2,"shiftMonth":month,"shiftYear":year,"shifts":leaves}
  console.log(saving_data);
  var request1 = new advanceRequests(saving_data) ;
  request1.save(function (err, request1) {
    if (err) return console.error(err);
    console.log(request1._id + " saved to exchangeRequests collection.");
    return res.status(200).json({ success: true, msg: "added successfully" });
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
    return res.status(200).json({ success: true, msg: "added successfully" });
  });
};

const getIndividualRoster = async (req, res) => {
  const month = req.query.month;
  const year = req.query.year;
  const months = req.query.months;
  const wardID = req.query.wardID;
  // const wardID=req.query.wardID;
  // const wardId_string=wardID.toString()
  // const myID=req.query.myID
  //console.log(months);
  var mongoose = require("mongoose");
  var id = mongoose.Types.ObjectId(wardID);
  function getMonthFromString(mon) {
    return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
  }

  const int_month = getMonthFromString(month) - 1;
  const finalShiftNames=[]

  const shiftNames_abstratct0=await shifts.find({month:months[0],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct0.length>0){
    const shiftNames=shiftNames_abstratct0[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  const shiftNames_abstratct1=await shifts.find({month:months[1],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct1.length>0){
    const shiftNames=shiftNames_abstratct1[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  const shiftNames_abstratct2=await shifts.find({month:months[2],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct2.length>0){
    const shiftNames=shiftNames_abstratct2[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  const shiftNames_abstratct3=await shifts.find({month:months[3],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct3.length>0){
    const shiftNames=shiftNames_abstratct3[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  console.log(finalShiftNames);

  const myShifts_abstract = [];

  const myShifts_abstract0 = await rosterSchema.find(
    { month: months[0], year: year, wardID: id },
    null,
    { limit: 1 }
  );
  if (myShifts_abstract0.length > 0) {
    myShifts_abstract.push(myShifts_abstract0[0].days);
  }else{
    myShifts_abstract.push([])
  }

  const myShifts_abstract1 = await rosterSchema.find(
    { month: months[1], year: year, wardID: id },
    null,
    { limit: 1 }
  );
  if (myShifts_abstract1.length > 0) {
    myShifts_abstract.push(myShifts_abstract1[0].days);
  }else{
    myShifts_abstract.push([])
  }

  const myShifts_abstract2 = await rosterSchema.find(
    { month: months[2], year: year, wardID: id },
    null,
    { limit: 1 }
  );
  if (myShifts_abstract2.length > 0) {
    myShifts_abstract.push(myShifts_abstract2[0].days);
  }else{
    myShifts_abstract.push([])
  }

  const myShifts_abstract3 = await rosterSchema.find(
    { month: months[3], year: year, wardID: id },
    null,
    { limit: 1 }
  );
  if (myShifts_abstract3.length > 0) {
    myShifts_abstract.push(myShifts_abstract3[0].days);
  }else{
    myShifts_abstract.push([])
  }

  return res
    .status(200)
    .json({ shiftNames: finalShiftNames, myShifts: myShifts_abstract });
};

const getWardDoctors=async(req,res)=>{
  const wardID=req.query.wardID;
  const wardId_string=wardID.toString();
  //console.log(wardId_string)
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardId_string);
  const ward_doctors = await Doctor.find({ wardID: wardID }, null, {});
  const doctorDetails = [];
  for (const doc of ward_doctors) {
    const id_string = doc._id.toString();
    doctorDetails.push([doc.docID, doc.firstName, doc.lastName, id_string]);
  }
  //console.log(doctorDetails)
  return res.status(200).json({"doctorDetails":doctorDetails});
}


const getShiftNames=async(req,res)=>{
  const month=req.query.month;
  const year=req.query.year;
  const wardID=req.query.wardID;

  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardID);
  const shiftNames_abstratct=await shifts.find({wardID:id},null,{limit:1});
  //console.log(shiftNames_abstratct)
  var shiftNames=[]
  if(shiftNames_abstratct.length>0){
      shiftNames=shiftNames_abstratct[0].shifts;
  }

  return res.status(200).json({"shiftNames":shiftNames});
}

const getShiftNamesForRoster=async(req,res)=>{
  const month=req.query.month;
  const year=req.query.year;
  const wardID=req.query.wardID;
  const months=req.query.months;

  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardID);
  
  const finalShiftNames=[]

  const shiftNames_abstratct0=await shifts.find({month:months[0],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct0.length>0){
    const shiftNames=shiftNames_abstratct0[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  const shiftNames_abstratct1=await shifts.find({month:months[1],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct1.length>0){
    const shiftNames=shiftNames_abstratct1[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  const shiftNames_abstratct2=await shifts.find({month:months[2],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct2.length>0){
    const shiftNames=shiftNames_abstratct2[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  const shiftNames_abstratct3=await shifts.find({month:months[3],year:year,wardID:id},null,{limit:1});
  if (shiftNames_abstratct3.length>0){
    const shiftNames=shiftNames_abstratct3[0].shifts;
    finalShiftNames.push(shiftNames)
  }else{
    finalShiftNames.push([])
  }

  console.log(finalShiftNames);


  return res.status(200).json({"shiftNames":finalShiftNames});
}

const getUserDetails = async (req, res) => {
  const userId = req.body.userName;
  console.log('user id',userId);
  const userType = req.body.type;
  console.log(req.body);

  let userDetails = null;
  let wardDetails = null;
 

  if (userType === "1") {
    console.log('doctor')
    userDetails = await Doctor.findOne({ emailaddress: userId });
    if (!userDetails) {
      console.log("doctor not found");
      return res.status(500).json({
        success: false,
        msg: "errroorrrrrrrrrr",
      });
    } else {
      console.log(userDetails);
      wardDetails = await Ward.findOne({ _id: userDetails.wardID });
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
const changePassword = async (req, res) => {
  console.log(req.body);
  if (!req.body) {
    return res.status(201).json({
      msg: "empty bodyy send froom the front end",
      success: false,
    });
  } else if (req.body) {
    const email = req.body.email;
    const currenrPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    let doctor = await Doctor.findOne({ emailaddress: email }, { password: 1 });
    console.log(doctor);
    if (!doctor) {
      return res.status(200).json({
        msg: "Current Password does not match",
        success: false,
      });
    } else {
      console.log(currenrPassword);
      var isMatch = await bcrypt.compare(currenrPassword, doctor.password);
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        let password1 = await bcrypt.hash("harshani@", salt);
        const hashedPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync()
        );

        try {
          let x = await Doctor.updateOne(
            { emailaddress: email },
            { $set: { password: hashedPassword } }
          );
          console.log("update password");
          return res.status(200).json({
            msg: "changed password successfully :)",
            success: true,
          });
        } catch {
          return res.status(200).json({
            msg: "Cant change the password.",
            success: false,
          });
        }
      } else {
        console.log("dddddddd");
        return res.status(200).json({
          msg: "You Current password is not match :(",
          success: false,
        });
      }
    }
  }
};


const getWardNamebyID=async(req,res)=>{
  const wardID=req.query.wardID;
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(wardID);
  const wards=await Ward.find({_id:id},null,{limit:1});
  const wardName=wards[0].wardNumber;
  return res.status(200).json({"wardNumber":wardName});
}


module.exports = {

  getUser,getData,submitLeaveRequest,submitPreferrableSlots,getIndividualRoster,getShiftNames, getInNotif, putNotif, getOutNotif, hideNotif, declineRequest, acceptRequest,getUserDetails,getWardDoctors,closeNotification,
  getWardNamebyID,changePassword, getWardDoctors,closeNotification,getShiftNamesForRoster
}

