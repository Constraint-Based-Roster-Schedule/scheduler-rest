const express=require("express");
const router=express.Router();
const doctorController=require("../controller/doctorController")

router.get('/getUser',doctorController.getUser)
router.get("/getInNotif", doctorController.getInNotif) 
router.put("/putRequest", doctorController.putNotif)
router.get("/getOutNotif", doctorController.getOutNotif)
router.put("/hideInNotif", doctorController.hideNotif)
router.put("/declineRequest", doctorController.declineRequest)
router.put("/acceptRequest", doctorController.acceptRequest)

module.exports=router;