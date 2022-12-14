
const Admin= require("../models/admin");
const Doctor=require("../models/doctor");
const Consultant=require("../models/consultant");
const Ward=require("../models/ward");
const NumberOfDoctors=require("../models/numberOfDoctors")
const express = require("express");
const app = express();
var nodemailer = require('nodemailer');


const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { findOneAndDelete } = require("../models/doctor");
const numberOfDoctors = require("../models/numberOfDoctors");

const getUser = async (req, res) => {
  const adminList = await Admin.find();
  if (!adminList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(adminList);
};


//add user and send a email to the added user mentioning the password
const addUser = async (req,res)=>{
  if(!req.body){
    return res.status(201).json({success:false,msg:"must have a body"})
  }else{
    if(req.body.type==="1"){


      console.log(req.body.type);
      var pass=req.body.password;
      const salt=await bcrypt.genSalt(10);
      var encryptedPass=await bcrypt.hash(pass,salt);
      req.body.password=encryptedPass;
      console.log(pass);


      const wardNumber=req.body.wardID;
      const wardDetails=await Ward.find({wardNumber:wardNumber},null,{limit:1});
      const ward_id=(wardDetails[0]._id).toString();
      req.body.wardID=ward_id;

      var mongoose = require('mongoose');
      var id = mongoose.Types.ObjectId(ward_id);
      const abc=await NumberOfDoctors.find({wardID:id},null,{limit:1});
      const next_id=abc[0].number
      req.body.docID=next_id;
      const filter = { wardID:id };
      const update = { number: next_id+1 };
      let doc = await NumberOfDoctors.findOneAndUpdate(filter, update, {
        new: true
      });


      var addUserRequestD=new Doctor(req.body);
      await addUserRequestD.save(function(err,addUserRequestD){
        if (err){

          console.error(err);
          return res.status(201).json({ success: false, msg: "Error" });
        }
        console.log(addUserRequestD._id + " added to the database");


      let transporter = nodemailer.createTransport({
             host: 'smtp.office365.com',
             port: 587,
             secure: false,  
             auth: {
                 user: "technestroster2022@outlook.com",
                 pass: "happyHallibut03"
             }
        })
        message = {
         from: "technestroster2022@outlook.com",
         to: req.body.emailaddress,
         subject: "Registration for Roster Care",
         text: `You have successfully registered for Roster Care. To log into the system, use ${pass} as the password`
      }
    transporter.sendMail(message, function(err, info) {
         if (err) {
           console.log(err)
         } else {
           console.log(info);
         }})

        return res
          .status(200)
          .json({ success: true, msg: "User added to system successfully" });
      });
    }
    else if (req.body.type === "2") {
      var pass = req.body.password;
      const salt = await bcrypt.genSalt(10);
      var encryptedPass = await bcrypt.hash(pass, salt);
      req.body.password = encryptedPass;

      const wardNumber=req.body.wardID;
      const wardDetails=await Ward.find({wardNumber:wardNumber},null,{limit:1});
      const ward_id=(wardDetails[0]._id).toString();
      req.body.wardID=ward_id;

      var addUserRequest = new Consultant(req.body);
      addUserRequest.save(function (err, addUserRequest) {
        if (err) {
          console.error(err);
          return res.status(201).json({ success: false, msg: "Error" });
        }

        console.log(addUserRequest._id+" added to the database")
        return res.status(200).json({success:true,msg:"User added to system successfully"})
      })
    }else{
      return res.status(200).json({success:false,msg:"Some error occured while adding user to the account"})
    }
  }
};


const getTakenEmails=async(req,res)=>{
  const doctors = await Doctor.find();
  const doctorEmails=[]
  for(const doc of doctors){
    doctorEmails.push(doc.emailaddress);
  }
  const consultants = await Consultant.find();
  const consEmails=[]
  for(const doc of consultants){
    consEmails.push(doc.emailaddress);
  }


  return res.status(200).json({"doctorEmails":doctorEmails,"constEmails":consEmails})
}

const getProfileDetails = async (req, res) => {
  if (!req.body) {
    return res.status();
  }
};

//function to get user details from the databse
const getUserDetails = async (req, res) => {
  const userName = req.body.userName;
  const userType = req.body.type;
  console.log(req.body);
  const a = null;
  let userDetails = null;
  let wardDetails = null;
  console.log(userName);

  // get admin details
  if (userType === "3") {
    userDetails = await Admin.findOne({ emailaddress:userName });
    if (!userDetails) {
      console.log("consultant not found");
      return res.status(500).json({
        success: false,
        msg: "errroorrrrrrrrrr",
      });
    } else {
      

      
      return res.status(200).json({
        success: true,
        msg: "get admin profile details correctly",
        fullName: userDetails.firstName + " " + userDetails.lastName,
        email: userDetails.emailaddress,
        address: userDetails.address,
        telephone: userDetails.telephone,
        emailaddress: userDetails.emailaddress,

        userName: userDetails.userName,
        speciality: userDetails.speciality,
      });

    }
  }
};

//function to add a ward to the database
const addWard = async (req, res) => {
  console.log("addd ward function");
  if(!req.body){
    return res.status(500).json({
      success:false,
      msg:'can not have empty body',
  })
  }
  else{
    console.log(req.body);
    var addWard = new Ward(req.body);
    await  addWard.save(function (err, addWard) {
        if (err) {
          console.error(err);
          return res.status(201).json({ success: false, msg: "Error" });
        }
        else
        {console.log(addWard._id + " added to the database");
        var wardAndDoctors=new numberOfDoctors({wardID:addWard._id,number:req.body.doctorCount});
        wardAndDoctors.save(function(err,wardAndDoctors){
          if(err){
            console.log('error when adding to number o doctor')
          }
          else{
            return res
          .status(200)
          .json({ success: true, msg: "User added to system successfully" });
          }
        })

        ;}
      });
  }
};


const getWardNumbersNames=async(req,res)=>{
  console.log()
  const wardDetails= await Ward.find({},{_id:0,wardName:1,wardNumber:1})
  if(!wardDetails){
    return res.status(500).json({
      success:false,
      msg:'no wards in the data base'
    })
  }
  console.log(wardDetails)
  let wardNumbers=[]
  let wardNames=[]
  for(var i=0;i<wardDetails.length;i++){
    wardNumbers.push(wardDetails[i].wardNumber)
    wardNames.push(wardDetails[i].wardName)
  }
  console.log(wardNames,wardNumbers)
  return res.status(200).json({
    success:true,
    wardNames:wardNames,
    wardNumbers:wardNumbers,
    msg:'successfully get the ward numbers and ward names'
  })
}     


//function to get details of ward doctors
const getDoctorDetails=async(req,res)=>{
  const docID=req.query.docID;
  const doc_det=await Doctor.find({docID:docID},null,{limit:1});
  const sending_data=[doc_det[0].firstName,doc_det[0].lastName,doc_det[0].address,doc_det[0].emailaddress,doc_det[0].telephone,doc_det[0].wardID.toString()]
  return res.status(200).json({"doctorDetails":sending_data,"docID":docID});
}

//function to get all doctors added to the system
const getAllDoctors=async(req,res)=>{
  const doc_det=await Doctor.find();
  const allDoctors=[]
  for(const doc of doc_det){
    const doc_detail=[doc.docID,doc.firstName,doc.lastName]
    allDoctors.push(doc_detail)
  }

  return res.status(200).json({"allDoctors":allDoctors});
}

//function to get all wards added to the system
const getAvailableWards=async(req,res)=>{
  const ward_det=await Ward.find();
  const availableWards=[];
  for(const ward of ward_det){
    availableWards.push(ward.wardNumber);
  }

  return res.status(200).json({"availableWards":availableWards});
}

//function to get ward details from the database
const getWardDetails=async(req,res)=>{
  const wardID=req.query.wardID;

  const ward_det=await Ward.find({wardNumber:wardID},null,{limit:1});
  const wardName=ward_det[0].wardName;
  const docObjID=ward_det[0]._id.toString();
  var mongoose = require('mongoose');
  var id = mongoose.Types.ObjectId(docObjID);
  const doc_detail=await Doctor.find({wardID:id},null,{});
  const consultantData_abstract=await Consultant.find({wardID:id},null,{});
  console.log(consultantData_abstract)
  var consultant_data=[]
  for(const con of consultantData_abstract){
    var temp =[]
    temp.push(con.firstName)
    temp.push(con.lastName)
    temp.push(con.emailaddress)
    temp.push(con.telephone)
    consultant_data.push(temp)
  }

  
  var data=[]
  for(const d of doc_detail){
    let required_data=[]
    required_data.push(d.firstName);
    required_data.push(d.lastName);
    required_data.push(d.emailaddress);
    required_data.push(d.telephone);
    data.push(required_data);         
      
  }
  return res.status(200).json({"wardName":wardName,"docData":data,"consultantData":consultant_data,"wardObj":docObjID});
}

//function to change password 
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
    let admin = await Admin.findOne(
      { emailaddress: email },
      { password: 1 }
    );

    if (!admin) {
      return res.status(200).json({
        msg: "Current Password does not match",
        success: false,
      });
    } else {
      console.log(currenrPassword);
      var isMatch = await bcrypt.compare(currenrPassword, admin.password);
      if (isMatch) {
      
        // now we set user password to hashed password
       
        const hashedPassword = bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync()
        );

        try {
          let x = await Admin.updateOne(
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

//function to get object id of the ward when integer id is given
const getWardID = async (req, res) =>{
  const intID=req.query.intID;
  const ward_det=await Ward.find({wardNumber:intID},null,{limit:1});
  const wardObjID=ward_det[0]._id.toString();
  return res.status(200).json({"wardObj":wardObjID});
}

module.exports = {
  getUser,addUser,getUserDetails,getWardDetails,getAvailableWards,getAllDoctors,getDoctorDetails,addWard,

  getWardNumbersNames,getWardID,getTakenEmails,changePassword


  



  

};
