const user = require('./users');
const express = require('express');
const saved = require('./saved');
const visController = require('../controller/vis');

const router = express.Router();
// console.log("This is the username in pages");
// console.log(user.email);
// console.log("username ends");
router.get('/', (req,res) => {
    res.render('index.hbs')
} );

router.get('/login', (req,res) => {
    res.render('login.hbs')
} );
router.get('/register', (req,res) => {
    res.render('register.hbs')
} );
router.get('/recycle_bin', (req,res) => {
    res.render('recycle_bin.hbs')
} );

router.post('/submitregister', user.register);
router.post('/save', saved.save);
router.post('/open/:data', saved.open);
router.post('/delete/:data', saved.delete);
router.post('/update/:data', saved.update);
router.post('/recycle', saved.recycle);
router.post('/restore/:data', saved.restore);
router.post('/submitlogin', user.login);



//FOR INSERTION FORM
router.get('/idx', (req, res) => {
    res.render('idx'); 
});
router.get('/add', (req, res) => {
    res.render('add', {email: user.email});
});
router.get('/add_casualties', (req, res) => {
    res.render('add_casualties'); 
});
router.get('/add_vehicles', (req, res) => {
    res.render('add_vehicles');
});

module.exports = router;