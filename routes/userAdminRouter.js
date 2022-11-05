const express=require("express");
const router=express.Router();
const adminController=require("../controller/adminController")
const userController=require("../controller/userController")
router.get('/getUser',adminController.getUser)
router.all('/addUser',adminController.addUser)

router.post('/userDetails',userController.getUserDetails)
module.exports=router;