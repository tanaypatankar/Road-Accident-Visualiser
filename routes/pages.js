var user = require('./users');
const express = require('express');
const router = express.Router();
console.log("This is the username in pages");
console.log(user.email);
console.log("username ends");
router.get('/', (req,res) => {
    res.render('index.hbs')
} );

router.get('/login', (req,res) => {
    res.render('login.hbs')
} );
router.get('/register', (req,res) => {
    res.render('register.hbs')
} );
router.post('/register', user.register);
router.post('/login', user.login);
module.exports = router;