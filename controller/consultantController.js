const {Doctor }= require("../model/Doctor");
const express = require("express");

const mongoose = require("mongoose");


const getUser = async (req, res) => {
  const doctorList = await Doctor.find();
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