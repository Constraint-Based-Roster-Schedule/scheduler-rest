var express = require('express');
const doctorAuthToken = require('../middleware/doctorAuthToken');
const doctorRouter = require("./userDoctorRouter")
const consultantRouter = require ("./userConsultantRouter")
const admniRouter = require ("./userAdminRouter") 
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("This is user route");
});
router.use("/doctor",doctorAuthToken, doctorRouter)

module.exports = router;