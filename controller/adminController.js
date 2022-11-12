const Admin= require("../models/admin");
const Doctor=require("../models/doctor");
const Consultant=require("../models/consultant");
const WardSchema=require("../models/ward");
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
    return res.status(201).json({success:false,msg:"can't have an empty body"})
  }else{
    if(req.body.type==="1"){
      var pass=req.body.password;
      const salt=await bcrypt.genSalt(10);
      var encryptedPass=await bcrypt.hash(pass,salt);
      req.body.password=encryptedPass;
      console.log(req.body);
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

const getWardDetails=async(req,res)=>{
  const wardID=req.query.wardID;

  const ward_det=await WardSchema.find({wardNumber:wardID},null,{limit:1});
  const wardName=ward_det[0].wardName;
  const docIDList=ward_det[0].doctorList;
  const consultant_id=ward_det[0].consultantID;

  const consultant_id_string=consultant_id.toString();
  const consultantData_abstract=await Consultant.findById(consultant_id_string).exec();
  
  const consultant_data=[]
  consultant_data.push(consultantData_abstract.firstName)
  consultant_data.push(consultantData_abstract.lastName)
  consultant_data.push(consultantData_abstract.emailaddress)
  consultant_data.push(consultantData_abstract.telephone)
  // console.log(consultant_data);
  
  var data=[]
  for(const d of docIDList){
    const id_string=d.toString();
    const result=await Doctor.findById(id_string).exec();
    let required_data=[]
    required_data.push(result.firstName);
    required_data.push(result.lastName);
    required_data.push(result.emailaddress);
    required_data.push(result.telephone);
    //console.log(required_data);
    data.push(required_data);         
      
  }
  //console.log(data);
  return res.status(200).json({"wardName":wardName,"docData":data,"consultantData":consultant_data});
}


module.exports = {
  getUser,addUser,getUserDetails,getWardDetails
};
