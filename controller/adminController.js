
const Admin= require("../models/admin");
const Doctor=require("../models/doctor");
const Consultant=require("../models/consultant");
const Ward=require("../models/ward");
const NumberOfDoctors=require("../models/numberOfDoctors")
const express = require("express");
const app = express();


const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const { findOneAndDelete } = require("../models/doctor");

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



      var pass=req.body.password;
      const salt=await bcrypt.genSalt(10);
      var encryptedPass=await bcrypt.hash(pass,salt);
      req.body.password=encryptedPass;


      const wardNumber=req.body.wardID;
      const wardDetails=await Ward.find({wardNumber:wardNumber},null,{limit:1});
      const ward_id=(wardDetails[0]._id).toString();
      req.body.wardID=ward_id;
      console.log(wardDetails)

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

      //console.log(doc) //TODO remove me
      var addUserRequestD=new Doctor(req.body);
      await addUserRequestD.save(function(err,addUserRequestD){
        if (err){

          console.error(err);
          return res.status(201).json({ success: false, msg: "Error" });
        }
        console.log(addUserRequestD._id + " added to the database");
        return res
          .status(200)
          .json({ success: true, msg: "User added to system successfully" });
      });
    }
    if (req.body.type === "2") {
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
      return res.status(201).json({success:false,msg:"empty body or type field invalid"})

    }
  }
};

const getProfileDetails = async (req, res) => {
  if (!req.body) {
    return res.status();
  }
};

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
      
      wardDetails = await Ward.findOne({ id: userDetails.wardID });
      
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
      addWard.save(function (err, addWard) {
        if (err) {
          console.error(err);
          return res.status(201).json({ success: false, msg: "Error" });
        }
        console.log(addWard._id + " added to the database");
        return res
          .status(200)
          .json({ success: true, msg: "User added to system successfully" });
      });
  }
};
const getWardNumbersNames=async(req,res)=>{
  console.log()
  // wardIds=Ward.find({},{projection:{wardName:1,wardNumber:1}}).toArray(function(err,result){
  //   if( err) throw err
  //   console.log(result);
  // })
  wardDetails= await Ward.find({},{_id:0,wardName:1,wardNumber:1})
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

const getDoctorDetails=async(req,res)=>{
  const docID=req.query.docID;
  const doc_det=await Doctor.find({docID:docID},null,{limit:1});
  const sending_data=[doc_det[0].firstName,doc_det[0].lastName,doc_det[0].address,doc_det[0].emailaddress,doc_det[0].telephone]
  //console.log(sending_data);
  return res.status(200).json({"doctorDetails":sending_data});
}

const getAllDoctors=async(req,res)=>{
  const doc_det=await Doctor.find();
  const allDoctors=[]
  for(const doc of doc_det){
    const doc_detail=[doc.docID,doc.firstName,doc.lastName]
    allDoctors.push(doc_detail)
  }
  console.log(allDoctors)
  return res.status(200).json({"allDoctors":allDoctors});
}

const getAvailableWards=async(req,res)=>{
  const ward_det=await Ward.find();
  //console.log(ward_det);
  const availableWards=[];
  for(const ward of ward_det){
    availableWards.push(ward.wardNumber);
  }
  //console.log(availableWards);
  return res.status(200).json({"availableWards":availableWards});
}

const getWardDetails=async(req,res)=>{
  const wardID=req.query.wardID;

  const ward_det=await Ward.find({wardNumber:wardID},null,{limit:1});
  //console.log(ward_det)
  const wardName=ward_det[0].wardName;
  const docIDList=ward_det[0].doctorList;
  // const consultant_id=ward_det[0].consultantID;

  // const consultant_id_string=consultant_id.toString();
  // const consultantData_abstract=await Consultant.findById(consultant_id_string).exec();
  
  const consultant_data=["saman","kumara","skhdiushd","iuefhaw"]
  // consultant_data.push(consultantData_abstract.firstName)
  // consultant_data.push(consultantData_abstract.lastName)
  // consultant_data.push(consultantData_abstract.emailaddress)
  // consultant_data.push(consultantData_abstract.telephone)
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
  getUser,addUser,getUserDetails,getWardDetails,getAvailableWards,getAllDoctors,getDoctorDetails,addWard,
  getWardNumbersNames

   

};
