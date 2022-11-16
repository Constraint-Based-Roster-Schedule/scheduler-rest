const Doctor = require("../models/doctor");
const express = require("express");

const mongoose = require("mongoose");
const Ward = require("../models/ward");
const Consultant = require("../models/consultant");
const Shift = require("../models/shifts");
const getUser = async (req, res) => {
  const doctorList = await Doctor.find();
  if (!doctorList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(doctorList);
};
const getUserDetails = async (req, res) => {
  const userName = req.userID;
  const userType = req.body.type;
  console.log(req.body);
  const a = null;
  let userDetails = null;
  let wardDetails = null;
  console.log(userName);

  // get consultant details
  if (userType === "2") {
    userDetails = await Consultant.findOne({ id: userName });
    if (!userDetails) {
      console.log("consultant not found");
      return res.status(500).json({
        success: false,
        msg: "errroorrrrrrrrrr",
      });
    } else {
      console.log(userDetails);
      wardDetails = await Ward.findOne({ id: userDetails.wardID });
      console.log(wardDetails.wardName);
      return res.status(200).json({
        success: true,
        msg: "get consultant profile details correctly",
        fullName: userDetails.firstName + " " + userDetails.lastName,
        email: userDetails.emailaddress,
        address: userDetails.address,
        telephone: userDetails.telephone,
        emailaddress: userDetails.emailaddress,
        wardName: wardDetails.wardName,
        wardId: wardDetails.wardNumber,
        userName: userDetails.userName,
        speciality: userDetails.speciality,
      });
      // res.send(userDetails);
    }
  }
};
// to get number of doctors in the ward
const getCountOfDoctors = async (req, res) => {
  // console.log(req.body);
  console.log("indide the get doctor count method");
  const wardID = req.body.wardID;
  let doctors = null;
  let doctorCount = 0;
  doctors = await Doctor.count({ wardID: wardID });
  if (doctors == 0) {
    console.log("No doctors for this ward");
    return res.status(500).json({
      success: false,
      msg: "no doctors found",
      doctorCount: 0,
    });
  } else {
    console.log("doctores found");
    // console.log(Doctor.find({wardID:wardID}));
    return res.status(200).json({
      msg: "doctor count founded",
      success: true,
      doctorCount: doctors,
    });
  }
};
const getShiftPerDay = async (req, res) => {
  console.log(req.body);
  console.log("ddddddddddddddddddddd");
  wardID = req.body.wardId;
  shiftCountOfWard = await Ward.findOne({ _id: wardID }, { shiftsPerDay: 1 });
  if (!shiftCountOfWard) {
    console.log("not found");
    res.status(201).json({
      msg: "no ward ",
      success: false,
    });
  } else {
    res.status(200).json({
      msg: "ward found",
      shiftCountOfWard: shiftCountOfWard.shiftsPerDay,
      success: true,
    });
  }
  console.log(shiftCountOfWard.shiftsPerDay);
};
const generateRoster = async (req, res) => {
  console.log(req.body);
  // send the below details
  // {
  //   month: '2022-03',
  //   numOfDoctors: 3,
  //   numOfMaxNightShifts: '2',
  //   numOfMaximumDoctors: '2',
  //   numOfMaximumShifts: '2',
  //   numOfMinimumDoctors: '2',
  //   numOfMinimumShifts: '2'
  // }
  let roster = null;
  // assign the roster to here from the algorithem
  isGenerated = false;
  if (isGenerated) {
    roster = { 1: [1, 2, 3], 2: [1, 2, 3] };
    return res.status(200).json({
      success: true,
      msg: "roster generated according to constraints",
      roster: roster,
    });
  } else {
    console.log("no roster for given costraints");
    return res.status(201).json({
      success: false,
      msg: "can not create a roster from given constraints",
    });
  }
};
const saveShift = async (req, res) => {
  console.log("in the save shift modle");
  if (!req.body) {
    res.status(500).json({
      success: false,
      msg: "cannot have empty body",
    });
  } else {
    console.log(req.body);
    var wardID = req.body.wardID;
    var month = req.body.month;
    var year = req.body.year;
    let availableShift=null
    availableShift=await Shift.findOne({wardID:wardID,month:month,year:year})
    if(availableShift){
      return res.status(201).json({
        msg:'already added',
        success:false
      })
    }else{
    var newShift = Shift(req.body);
    await newShift.save(function (err, newShift) {
      if (err) {
        console.error(err);
        return res
          .status(201)
          .json({ success: false, msg: "cannot add to the database" });
      }
      console.log(newShift._id + "shift added to the database");
      return res
        .status(200)
        .json({ success: true, msg: "shift added to system successfully" });
    });}
  }
};
module.exports = {
  getUser,
  getUserDetails,
  getCountOfDoctors,
  generateRoster,
  saveShift,
  getShiftPerDay,
};
