const Admin= require("../models/admin");
const Doctor=require("../models/doctor");
const Consultant=require("../models/consultant");
const express = require("express");
const app=express();
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


module.exports = {
  getUser,addUser
};
