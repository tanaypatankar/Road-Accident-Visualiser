const express = require("express");
const path = require("path");
//const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyparser = require('body-parser');
let cors = require('cors')
var hbs = require('hbs');
const { extname } = require("path");

// hbs.registerPartial('partial', fs.readFileSync(__dirname + '/views/partial.hbs', 'utf8'));
hbs.registerPartials(__dirname + '/views/partials');
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
app.use('/users', require('./routes/users'));
const router = express.Router();

//AUTHORIZE FORM
const authController = require('./controllers/auth'); 
app.post("/auth/add", authController.register);
app.post("/auth/add_casualties", authController.add_casualties);
app.post("/auth/add_vehicles", authController.add_vehicles);

// '/' directory of express
router.get('/', (req,res) => {
    res.render('index.hbs')
} );

module.exports = router;


// Start express on port 5000
app.listen(5009, () => {
    console.log("Server started on port 5009");
});