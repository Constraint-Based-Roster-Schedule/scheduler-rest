const {Admin}= require("../models/Admin");
const express = require("express");

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
module.exports = {
  getUser,
};
