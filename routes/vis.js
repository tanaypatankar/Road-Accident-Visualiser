const express = require('express');
const visController = require('../controller/vis');
const router = express.Router();

// '/' directory of express
router.post('/createvis', visController.create)

module.exports = router;