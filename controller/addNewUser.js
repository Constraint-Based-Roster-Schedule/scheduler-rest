const mongoose = require("mongoose");
const express = require('express');
const JWT = require('jsonwebtoken') 
const bcrypt = require("bcrypt")

const add = async (req,res)=>{
    console.log("hiiiiiiiiiiiiiii");
    console.log(req.body);
    return res.send(req.body);
}


module.exports={add};