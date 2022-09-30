var express = require('express');
var userController = require('../controllers/userController')
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("This is user route");
});


router.post("/add_user", userController.addUser) ;
router.get("/get_user", userController.getUser) ;



module.exports = router ;