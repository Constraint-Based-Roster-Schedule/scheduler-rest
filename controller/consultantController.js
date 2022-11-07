const {Doctor }= require("../models/doctor");
const express = require("express");

const mongoose = require("mongoose");
const Ward=require('../models/ward')
const Consultant=require('../models/consultant')
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
  const userName = req.body.userName;
  const userType = req.body.type;
  console.log(req.body);
  const a = null;
  let userDetails = null;
  let wardDetails = null;
  console.log(userName);

  

  // get consultant details
  if (userType === "2") {
    userDetails = await Consultant.findOne({ emailaddress: userName });
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



module.exports = {
  getUser,getUserDetails
};