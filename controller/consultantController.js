const Doctor = require("../models/doctor");
const express = require("express");

const mongoose = require("mongoose");
const Ward = require("../models/ward");
const Consultant = require("../models/consultant");
const Roster = require('../models/rosterSchema') ;
const AdvanceRequest = require('../models/advanceRequest');

const SchedulerController = require("./schedulerController");
const advanceRequest = require("../models/advanceRequest");
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
const generateRoster = async (req, res) => {
  console.log(req.body);
  const scheduler = new SchedulerController(req.body) ;
  // TODO: check the body here
  const dataCheck = scheduler.verifyBody() ;
  if (!dataCheck) {
    return res.status(500).json({
      success: false,
      msg: "body verification failed",
    });
  }
  const genRoster = await scheduler.dispatchAPIRequest() ;
  console.log(genRoster);
  
  // assign the roster to here from the algorithem
  if (genRoster.message === "success") {
    isGenerated = true ;
  } else {
    isGenerated = false ;
  }

  
  if (isGenerated) {
    return res.status(200).json({
      success: true,
      msg: "roster generated according to constraints",
      roster: genRoster.roster
    });
  } else {
    console.log("no roster for given costraints");
    return res.status(201).json({
      success: false,
      msg: "can not create a roster from given constraints",
    });
  }
};

const saveRoster =  async (req, res)=> {
  // getting the next month and year as strings
  const nowDate = new Date();
  const nextMonth = new Date() ;
  nextMonth.setMonth(nowDate.getMonth() + 1) ;
  const month = nextMonth.toLocaleString('default', { month: 'long' });
  const year = nextMonth.getFullYear().toString();

  //check request
  const requiredFields = ["wardID", "roster"]
  const recievedKeys = Object.keys(req.body) ;
  for (const key in requiredFields) {
    if (!recievedKeys.includes(requiredFields[key])) {
      return res.status(400).json({success: false, message:"bad request"})
    }
  };
  
  //check if the roster is already present in the database
  const isPresent = Roster.exists({month: month, year: year})
  if (isPresent) {
    return res.status(400).json({success: false, message: "roster already present"});
  }
  //save the roster
  const wardID = mongoose.Types.ObjectId(req.body.wardID) ;
  const roster = new Roster({wardID: wardID, month: month, days: req.body.roster, year: year});
  await roster.save(err => {
    if (err) return res.status(400).json({success: false, message: "database save failed"})
  });
  return res.status(200).json({success: true, message:"roster saved"}) 

}

const getWardDoctorList = async (wardID)=>{
  
  const doctorList = []
  return doctorList 
}

const getPrefered = async (wardID, month, year) =>{
  const preferedRequests = [] 
  advanceRequest.find({typeID: 1, month: month, wardID: wardID, year: year},'doctorNumber, shifts', (err, docs) =>{
    docs.forEach(record => {
      console.log(record.shifts);
    });
  })
  
  return preferedRequests
}
module.exports = {
  getUser,
  getUserDetails,
  getCountOfDoctors,
  generateRoster,
  saveRoster,
  getWardDoctorList,
};
