const express = require('express');
const router = express.Router();

// '/' directory of express
router.get('/', (req,res) => {
    res.render('index.hbs')
} );
router.get('/login', (req,res) => {
    res.render('login.hbs')
} );
router.get('/register', (req,res) => {
    res.render('register.hbs')
} );
router.get('/visselection', (req,res) => {
    res.render('visselection.hbs')
} );

module.exports = router;