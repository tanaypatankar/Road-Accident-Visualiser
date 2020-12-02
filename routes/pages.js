let user = require('./users');
const express = require('express');
const router = express.Router();
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
    res.render('visselection.hbs', {email: user})
} );



//FOR INSERTION FORM
router.get('/idx', (req, res) => {
    res.render('idx'); 
});
router.get('/add', (req, res) => {
    res.render('add');
});
router.get('/add_casualties', (req, res) => {
    res.render('add_casualties'); 
});
router.get('/add_vehicles', (req, res) => {
    res.render('add_vehicles');
});

module.exports = router;