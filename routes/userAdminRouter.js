const express=require("express");
const router=express.Router();
const adminController=require("../controller/adminController")

router.get('/getUser',adminController.getUser)
router.all('/addUser',adminController.addUser)

router.post('/userDetails',adminController.getUserDetails);
router.get('/getWardDetails',adminController.getWardDetails);
router.get("/getAvailableWards",adminController.getAvailableWards);
module.exports=router;