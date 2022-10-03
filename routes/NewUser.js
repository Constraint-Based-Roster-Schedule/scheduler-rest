var express = require('express');
var router = express.Router();
const addNewUser=require('../controller/addNewUser')

/* GET users listing. */
router.all("/", addNewUser.add);

module.exports = router;