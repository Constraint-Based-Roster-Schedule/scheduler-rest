
const mongoose = require("mongoose");
const express = require('express');
const Doctor = require("../model/Doctor");
const JWT = require('jsonwebtoken')

const login = async (req,res)=>{
    const emailAddress=req.body.emailAddress;
    const password=req.body.password;
    const type=req.body.type;
    console.log(password); //TODO: remove this
    let user=null;
    
    switch(type){
        
        case '1':{
            console.log("inside case1")
            user=await Doctor.findOne({emailAddress:emailAddress})
            if(!user){
                return res.status(201).json({success:false , msg:"unsuccessful."})
            }

            
            //TODO: password hashing 

            if(password==user.password){
                //create token
                const token = JWT.sign(
                    {userName:emailAddress,userType:type}, //attributes that we want to get in frontend 
                    process.env.ACCESS_TOKEN_SECRET, //secreat key
                    {
                        expiresIn : "2h",    //
                    }
                )
                console.log("login success")
                return res.status(200).send({success:true , token:token , msg:"successfully login......."})
            }
            else{
                return res.status(201).json({success:false, msg:'User name or password is invalid'})
            }
           
        }
        case '2':{
            user=await Consultant.findOne({emailAddress:emailAddress})
            if(!user){
                return res.status(201).json({success:false , msg:"unsuccessful."})
            }

            //TODO: password hashing 

            if(password==Consultant.password){
                const token = JWT.sign(
                    {userName:emailAddress,userType:type}, //
                    process.env.ACCESS_TOKEN_SECRET, //secreat key
                    {
                        expiresIn : "2d",    //
                    }
                )
                return res.status(200).send({success:true , token:token , msg:"successfully login......."})
            }
            else{
                return res.status(201).json({success:false, msg:'User name or password is invalid'})
            }
           
        }
        case '3':{
            user=await Admin.findOne({emailAddress:emailAddress})

            if(!user){
                return res.status(201).json({success:false , msg:"unsuccessful."})
            }
            //TODO: password hashing 

            if(password==user.password){
                const token = JWT.sign(
                    {userName:emailAddress,userType:type}, //
                    process.env.ACCESS_TOKEN_SECRET, //secreat key
                    {
                        expiresIn : "2d",    //
                    }
                )
                return res.status(200).send({success:true , token:token , msg:"successfully login......."})
            }
            else{
                return res.status(201).json({success:false, msg:'User name or password is invalid'})
            }
           
        }
}
}


module.exports = {login}

