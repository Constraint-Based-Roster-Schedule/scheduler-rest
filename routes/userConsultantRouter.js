const express=require("express");
const router=express.Router();
const consultantController=require("../controller/consultantController")

router.get('/getUser',consultantController.getUser)

router.post('/userDetails',consultantController.getUserDetails)
router.post('/doctorsCount',consultantController.getCountOfDoctors)
router.post('/generateRoster',consultantController.generateRoster)
router.post('/saveRoster',consultantController.saveRoster)
router.post('/testPath', consultantController.testPath) //TODO: remove this

module.exports=router;