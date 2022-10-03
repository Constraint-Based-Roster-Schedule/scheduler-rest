const {Admin}= require("../models/admin");
const express = require("express");
const app=express();

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
    console.log("hiiiiiiiiiiiiiii");
    console.log(req.body);
    return res.send(req.body);
}


module.exports = {
  getUser,addUser
};
