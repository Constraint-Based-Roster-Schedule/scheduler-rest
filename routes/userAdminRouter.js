const express=require("express");
const router=express.Router();
const adminController=require("../controller/adminController")

router.get('/getUser',adminController.getUser)

module.exports=router;