const express=require("express");
const router=express.Router();
const consultantController=require("../controller/consultantController")

router.get('/getUser',consultantController.getUser)

router.post('/userDetails',consultantController.getUserDetails)
router.post('/doctorsCount',consultantController.getCountOfDoctors)
router.post('/generateRoster',consultantController.generateRoster)
router.post('/getShiftCount',consultantController.getShiftPerDay)
router.post('/addShift',consultantController.saveShift)
module.exports=router;