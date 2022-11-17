const express=require("express");
const router=express.Router();
const doctorController=require("../controller/doctorController")


router.get('/getUser',doctorController.getUser)
router.get("/getInNotif", doctorController.getInNotif) 
router.all("/putRequest", doctorController.putNotif)
router.get("/getOutNotif", doctorController.getOutNotif)
router.put("/hideInNotif", doctorController.hideNotif)
router.get("/declineRequest", doctorController.declineRequest)
router.get("/acceptRequest", doctorController.acceptRequest)
router.get('/getData',doctorController.getData);
router.all('/submitLeaveRequest',doctorController.submitLeaveRequest),
router.all('/submitPrefferableSlots',doctorController.submitPreferrableSlots);
router.all('/getRosterObject',doctorController.getIndividualRoster);
router.get('/getShiftNames',doctorController.getShiftNames);
router.post('/userDetails',doctorController.getUserDetails);
router.get('/getWardDoctors',doctorController.getWardDoctors);
router.get('/closeNotification',doctorController.closeNotification);

module.exports=router;