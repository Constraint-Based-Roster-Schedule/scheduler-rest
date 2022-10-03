const mongoose = require("mongoose");
const express = require('express');
const JWT = require('jsonwebtoken') ;
const bcrypt = require("bcrypt");

const getData=(req,res)=>{
    const wardDoctors=[[1,'Thinira Wanasingha'],[2,'Sakuni Bandara'], [3,'Gamunu Bandara'], [4,'Harshani Bandara']];
    const myShifts={
        "1":[0,1],
        "2":[1],
        "3":[0,1],
        "4":[2],
        "5":[1],
        "6":[1,2],
        "7":[0,1],
        "8":[0,1],
        "9":[1],
        "10":[2],
        "11":[1,2],
        "12":[0,1],
        "13":[2],
        "14":[1],
        "15":[1,2]
    };
    
    return res.status(200).json({"wardDoctors":wardDoctors,"myShifts":myShifts});
}

const submitShiftExchange=(req,res)=>{
    
    console.log(req.body);
    return res.send(req.body);
}

module.exports={getData,submitShiftExchange}