const express=require("express");
const router=express.Router();
const doctorController=require("../controller/doctorController")

router.get('/getUser',doctorController.getUser);
router.get('/getData',doctorController.getData);
router.all('/submitShiftRequest',doctorController.submitShiftExchange),

module.exports=router;