var express = require('express');

const doctorAuthToken = require('../middleware/doctorAuthToken');
const adminAuthToken=require('../middleware/adminAuthToken')
const doctorRouter = require("./userDoctorRouter")
const consultantRouter = require ("./userConsultantRouter")
const admniRouter = require ("./userAdminRouter"); 


var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("This is user route");
});

router.use("/doctor",doctorRouter)

router.use("/admin",admniRouter)
router.use("/consultant",consultantRouter)
//FIXME: uncomment the controllers after implementation
/*
router.post("/add_user", userController.addUser) ; 
   
*/ 




module.exports = router ;