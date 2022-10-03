const {Doctor }= require("../models/Doctor");
const express = require("express");
const {Consultant}=require("../models/Consultant");
const mongoose = require("mongoose");


const getUser = async (req, res) => {
  const doctorList = await Consultant.find();
  if (!doctorList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(doctorList);
};
module.exports = {
  getUser,
};