var express = require('express');
var router = express.Router();
const shiftExchangeController=require('../controller/shiftExchangeController');

router.all('/getData',shiftExchangeController.getData);
router.all('/submitShiftRequest',shiftExchangeController.submitShiftExchange),

module.exports = router;