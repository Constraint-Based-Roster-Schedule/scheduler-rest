const Doctor = require("../models/doctor");
const express = require("express");

const mongoose = require("mongoose");
const Ward = require("../models/ward");
const Consultant = require("../models/consultant");

const Shift = require("../models/shifts");
const bcrypt = require("bcrypt");

const Roster = require('../models/rosterSchema') ;
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
  const wardObjID = mongoose.Types.ObjectId(req.body.wardID)
  const preferences = await getPrefered(wardObjID, req.body.month, req.body.year) ;
  const leaves = await getNotPrefered (wardObjID, req.body.month, req.body.year)
  const doctor_num = req.body.numOfDoctors
  const shift_num = req.body.shiftNum 
  const days_num = req.body.numOfDays
  const doctors_per_shift = req.body.numOfMaximumDoctors 
  var leave_requests ;
  var preference_requests ;
  if (req.body.isPref) {
    leave_requests = leaves 
  }else {
    leave_requests = []

  }
  if (req.body.isLeave) {
    preference_requests = preferences 
  }else {
    preference_requests = []

  }

  const requestToScheduler = { 
    doctor_num: doctor_num,
    shift_num: shift_num,
    days_num: days_num,
    doctors_per_shift: doctors_per_shift, 
    leave_requests: leave_requests,
    preference_requests: preference_requests
  }
  console.log(requestToScheduler);

  const scheduler = new SchedulerController(requestToScheduler) ;
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
    let availableShift = null;
    availableShift = await Shift.findOne({
      wardID: wardID,
      month: month,
      year: year,
    });
    if (availableShift) {
      return res.status(201).json({
        msg: "already added",
        success: false,
      });
    } else {
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
      });
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
    let consultant = await Consultant.findOne(
      { emailaddress: email },
      { password: 1 }
    );
    console.log(consultant);
    if (!consultant) {
      return res.status(200).json({
        msg: "Current Password does not match",
        success: false,
      });
    } else {
      console.log(currenrPassword);
      var isMatch = await bcrypt.compare(currenrPassword, consultant.password);
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        let password1 = await bcrypt.hash("harshani@", salt);
        const hashedPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync()
        );


        try {
          let x = await Consultant.updateOne(
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


const testPath = async (req, res) => {
  const wardID = mongoose.Types.ObjectId("6371a53b963e2cb4f2f65a0c")
  month = "december" 
  year = "2022"

  const result = await getNotPrefered(wardID,month,year) 
  console.log(result); 

  return res.status(200).json({
    success: true }) 
}

const getPrefered = async (wardID, month, year) =>{
  //need to get preferences from the database 
  var preferedRequests ;
  const outputList = [] ; 

  //fetches the preferences from the database with matching wardID, and popoulates the doctor stub and selects the docID
  preferedRequests = await advanceRequest.find({typeID: 1, shiftMonth: month, wardNumber: wardID, shiftYear: year},'doctorNumber shifts')
  .populate ({
    path: 'doctorNumber',
    model: 'Doctor',
    select : 'docID -_id'
  })

  //interate and convert 

  preferedRequests.forEach(element => {
    const doctorID = element.doctorNumber.docID
    const shiftList = element.shifts 
    shiftList.forEach(element => {
      const shiftArray = JSON.parse(element) 
      shiftArray.unshift(doctorID)
      outputList.push(shiftArray)
    });
   

  });
  //return preferedRequests
  return outputList 
}

const getNotPrefered = async (wardID, month, year) => {
  //need to get preferences from the database 
  var notPreferedRequests ;
  const outputList = [] ; 

  //fetches the preferences from the database with matching wardID, and popoulates the doctor stub and selects the docID
  notPreferedRequests = await advanceRequest.find({typeID: 2, shiftMonth: month, wardNumber: wardID, shiftYear: year},'doctorNumber shifts')
  .populate ({
    path: 'doctorNumber',
    model: 'Doctor',
    select : 'docID -_id'
  })

  //interate and convert 

  notPreferedRequests.forEach(element => {
    const doctorID = element.doctorNumber.docID
    const shiftList = element.shifts 
    shiftList.forEach(element => {
      const shiftArray = JSON.parse(element) 
      shiftArray.unshift(doctorID)
      outputList.push(shiftArray)
    });
   

  });
  //return preferedRequests
  return outputList 
}



module.exports = {
  getUser,
  getUserDetails,
  getCountOfDoctors,
  generateRoster,
  saveShift,
  getShiftPerDay,
  changePassword,
  saveRoster,
  testPath,
  getWardDoctorList,


};
