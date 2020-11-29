const express = require('express');
const visController = require('../controller/vis');
const router = express.Router();
var user = require("../routes/users");
console.log("This is the username in vis");
console.log(user);
console.log("username ends");

// '/' directory of express
router.post('/createvis', visController.create)

module.exports = router;