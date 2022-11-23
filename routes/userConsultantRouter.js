const express=require("express");
const router=express.Router();
const consultantController=require("../controller/consultantController")

router.get('/getUser',consultantController.getUser)

router.post('/userDetails',consultantController.getUserDetails)
router.post('/doctorsCount',consultantController.getCountOfDoctors)
router.post('/generateRoster',consultantController.generateRoster)

router.post('/getShiftCount',consultantController.getShiftPerDay)

router.post('/addShift',consultantController.saveShift);
router.get('/getWardNamebyID',consultantController.getWardNamebyID);
router.get('/getShiftNames',consultantController.getShiftNames);

router.post('/changePassword',consultantController.changePassword)

router.post('/saveRoster',consultantController.saveRoster)
router.post('/testPath', consultantController.testPath) //TODO: remove this
router.post('/shiftNames',consultantController.getShiftNames)
router.get('/getShiftNamesForRoster',consultantController.getShiftNamesForRoster)
module.exports=router;