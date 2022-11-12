const Admin= require("../models/admin");
const Doctor=require("../models/doctor");
const Consultant=require("../models/consultant");
const express = require("express");
const app=express();

const Ward=require('../models/ward')

const bcrypt=require("bcrypt");

const mongoose = require("mongoose");


const getUser = async (req, res) => {
  const adminList = await Admin.find();
  if (!adminList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(adminList);
};

const addUser = async (req,res)=>{
  if(!req.body){
    return res.status(201).json({success:false,msg:"must have a body"})
  }else{
    if(req.body.type==="1"){

      console.log(req.body) //TODO remove me

      var pass=req.body.password;
      const salt=await bcrypt.genSalt(10);
      var encryptedPass=await bcrypt.hash(pass,salt);
      req.body.password=encryptedPass;
      

      var addUserRequestD=new Doctor(req.body);
      addUserRequestD.save(function(err,addUserRequestD){
        if (err){
          console.error(err);
          return res.status(201).json({success:false,msg:"Error"})
        }
        console.log(addUserRequestD._id+" added to the database")
        return res.status(200).json({success:true,msg:"User added to system successfully"})
      })
    }if(req.body.type==="2"){
      var pass=req.body.password;
      const salt=await bcrypt.genSalt(10);
      var encryptedPass=await bcrypt.hash(pass,salt);
      req.body.password=encryptedPass;
      var addUserRequest=new Consultant(req.body);
      addUserRequest.save(function(err,addUserRequest){
        if (err){
          console.error(err);
          return res.status(201).json({success:false,msg:"Error"})
        }
        console.log(addUserRequest._id+" added to the database")
        return res.status(200).json({success:true,msg:"User added to system successfully"})
      })
    }else{
      return res.status(201).json({success:false,msg:"empty body or type field invalid"})
    }
    
  }
    
}
const getProfileDetails= async(req, res)=>{
  if(!req.body){
    return res.status()
  }
}

const getUserDetails = async (req, res) => {
  const userName = req.userID;
  const userType = req.body.type;
  console.log(req.body);
  const a = null;
  let userDetails = null;
  let wardDetails = null;
  console.log(userName);

  

  // get admin details
  if (userType === "3") {
    userDetails = await Admin.findOne({ id: userName });
    if (!userDetails) {
      console.log("consultant not found");
      return res.status(500).json({
        success: false,
        msg: "errroorrrrrrrrrr",
      });
    } else {
      console.log(userDetails);
      wardDetails = await Ward.findOne({ id: userDetails.wardID });
      console.log(wardDetails);
      return res.status(200).json({
        success: true,
        msg: "get admin profile details correctly",
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
  getUser,addUser,getUserDetails
};
