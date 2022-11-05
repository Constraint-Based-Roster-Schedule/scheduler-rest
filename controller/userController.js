const Doctor = require("../models/doctor");
const Ward = require("../models/ward");
const Consultant = require("../models/consultant");
const Admin=require('../models/admin')
const getUserDetails = async (req, res) => {
  const userName = req.body.userName;
  const userType = req.body.type;
  console.log(req.body);
  const a = null;
  let userDetails = null;
  let wardDetails = null;
  console.log(userName);

  if (userType === "1") {
    userDetails = await Doctor.findOne({ emailaddress: userName });
    if (!userDetails) {
      console.log("doctor not found");
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
        userName: userDetails.userName,
      });
      // res.send(userDetails);
    }
  }

  // get consultant details
  else if (userType === "2") {
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
      console.log(wardDetails);
      return res.status(200).json({
        success: true,
        msg: "get profile details correctly",
        fullName: userDetails.firstName + " " + userDetails.lastName,
        email: userDetails.emailaddress,
        address: userDetails.address,
        telephone: userDetails.telephone,
        emailaddress: userDetails.emailaddress,
        wardName: wardDetails.wardName,
        wardId: wardDetails.wardNumber,
        userName: userDetails.userName,
        speciality:userDetails.speciality
      });
      // res.send(userDetails);
    }
  }


  // get admin details
  else if (userType === "3") {
    userDetails = await Admin.findOne({ emailaddress: userName });
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
        msg: "get profile details correctly",
        fullName: userDetails.firstName + " " + userDetails.lastName,
        email: userDetails.emailaddress,
        address: userDetails.address,
        telephone: userDetails.telephone,
        emailaddress: userDetails.emailaddress,
        wardName: wardDetails.wardName,
        wardId: wardDetails.wardNumber,
        userName: userDetails.userName,
        speciality:userDetails.speciality
      });
      // res.send(userDetails);
    }
  }
};

module.exports = {
  getUserDetails,
};
