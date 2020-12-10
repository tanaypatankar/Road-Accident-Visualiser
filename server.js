const express = require("express");
const path = require("path");
//const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyparser = require('body-parser');
let cors = require('cors')
var hbs = require('hbs');
const { extname } = require("path");
// const path = require("path")

hbs.registerPartials(path.join(__dirname + 'views/partials'));
// Set env path
dotenv.config({path: './.env'});

// Start express
const app = express();

app.use(bodyparser.json());

// Loation of local css and what not files
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse forms to json
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'hbs');
app.use(cors())

app.use('/', require('./routes/pages'));
app.use('/vis', require('./routes/vis'));

//AUTHORIZE FORM
const authController = require('./controllers/auth'); 
app.post("/add", authController.register);
app.post("/add_casualties", authController.add_casualties);
app.post("/add_vehicles", authController.add_vehicles);

// Start express on port 5000
app.listen(5009, () => {
    console.log("Server started on port 5009");
});