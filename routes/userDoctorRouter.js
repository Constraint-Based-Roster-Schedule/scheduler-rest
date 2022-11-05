const express=require("express");
const router=express.Router();
const doctorController=require("../controller/doctorController")
const userController=require("../controller/userController")

router.get('/getUser',doctorController.getUser)
router.get("/getInNotif", doctorController.getInNotif) 
router.put("/putRequest", doctorController.putNotif)
router.get("/getOutNotif", doctorController.getOutNotif)
router.put("/hideInNotif", doctorController.hideNotif)
router.put("/declineRequest", doctorController.declineRequest)
router.put("/acceptRequest", doctorController.acceptRequest)


router.get('/getData',doctorController.getData);

router.all('/submitLeaveRequest',doctorController.submitLeaveRequest),
router.all('/submitPrefferableSlots',doctorController.submitPreferrableSlots);
router.all('/getRosterObject',doctorController.getIndividualRoster);
router.get('/getShiftNames',doctorController.getShiftNames);


router.post('/userDetails',userController.getUserDetails)

module.exports=router;