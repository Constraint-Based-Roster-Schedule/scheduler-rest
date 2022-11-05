const express=require("express");
const router=express.Router();
const consultantController=require("../controller/consultantController")
const userController=require("../controller/userController")
router.get('/getUser',consultantController.getUser)

router.post('/userDetails',userController.getUserDetails)
module.exports=router;