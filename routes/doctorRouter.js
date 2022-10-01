const express=require("express");
const router=express.Router();
const doctorController=require("../controller/doctorController")

router.get('/getUser',doctorController.getUser)

module.exports=router;