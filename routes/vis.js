const express = require('express');
const visController = require('../controller/vis');
const router = express.Router();
const user = require("../routes/users");
router.post('/createvis', visController.create)

module.exports = router;