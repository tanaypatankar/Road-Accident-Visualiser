const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyparser = require('body-parser');



// Set env path
dotenv.config({path: './.env'});

// Start express
const app = express();

app.use(bodyparser.json());

// Database parameters
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Loation of local css and what not files
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse forms to json
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'hbs');

// connect to database
db.connect((err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("MySQL connected.")
    }
})

// '/' directory of express
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


// Start express on port 5000
app.listen(5000, () => {
    console.log("Server started on port 5000");
});