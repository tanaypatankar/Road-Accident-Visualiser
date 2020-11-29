const express = require('express');
const visController = require('../controller/vis');
const router = express.Router();
const user = require("../routes/users");
console.log("This is the username");
console.log(user.email);
console.log("username ends");

// '/' directory of express
router.post('/createvis', visController.create)

module.exports = router;