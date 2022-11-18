const express=require("express");
const router=express.Router();
const adminController=require("../controller/adminController")

router.get('/getUser',adminController.getUser)
router.all('/addUser',adminController.addUser)

router.post('/userDetails',adminController.getUserDetails);
router.get('/getWardDetails',adminController.getWardDetails);
router.get("/getAvailableWards",adminController.getAvailableWards);

router.get("/getAllDoctors",adminController.getAllDoctors);
router.get("/getDoctorDetails",adminController.getDoctorDetails);


router.post('/addWard',adminController.addWard)
router.post('/getWardNumbersNames',adminController.getWardNumbersNames)
router.post('/getWardID',adminController.getWardID);
router.get('/getTakenEmails',adminController.getTakenEmails);
module.exports=router;