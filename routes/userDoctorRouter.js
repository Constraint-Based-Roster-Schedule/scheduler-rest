const express=require("express");
const router=express.Router();
const doctorController=require("../controller/doctorController")

router.get('/getUser',doctorController.getUser);
router.get('/getData',doctorController.getData);
router.all('/submitShiftRequest',doctorController.submitShiftExchange),
router.all('/submitLeaveRequest',doctorController.submitLeaveRequest),
router.all('/submitPrefferableSlots',doctorController.submitPreferrableSlots);

module.exports=router;