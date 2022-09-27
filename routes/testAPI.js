var express = require('express');
var router = express.Router();

/* GET users listing. */
router.all("/", function(req, res, next) {
  console.log("hi");
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;