const express=require("express");
const router=express.Router();
const adminController=require("../controller/adminController")

router.get('/getUser',adminController.getUser)
router.all('/addUser',adminController.addUser)

module.exports=router;