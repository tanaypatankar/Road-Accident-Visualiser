var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
// const router = express.Router();
const db  = mysql.createPool({
  connectionLimit : 1,
  host: process.env.NEW_DATABASE_HOST,
  user: process.env.NEW_DATABASE_USER,
  password: process.env.NEW_DATABASE_PASSWORD,
  database: process.env.NEW_DATABASE
});

var list = [{name: "harshad"}, {name: "harshad"}, {name: "harshad"}, {name: "tanay"}];
async function register(req,res)
{
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)

  //the users dictionary is what goes into the db, the keys are column names.
  var users={
     'email': req.body.email,
     'pwd': encryptedPassword
   }

   db.query('SELECT * FROM users WHERE email = ?;',[users.email], async function (error, results, fields) {
     if(error){
       console.log(error);
     }
     else{
       if(results.length != 0)
       {
        res.send({
          'code':204,
          'failed':'User already exists:\n'
        })
       }
       else{
        db.query('INSERT INTO users SET ?',users, function (error, results, fields) {
          if (error) 
          {
            res.send({
              'code':400,
              'failed':'An error occurred while connecting to the MySQL db:\n' + error.stack
            })
          }
          else
          {
            exports.email = users.email;
            console.log("This is the username in users:", exports.email);
            res.render('user_home', {email: users.email, list: list});
          }
        });
       }
     }
   });
  
  
}

async function login(req,res)
{
  var email= req.body.email;
  var password = req.body.password;
  console.log(email);
  db.query('SELECT * FROM users WHERE email = ?;',[email], async function (error, results, fields) {
    if (error) {
      res.send({
        'code':400,
        'failed': 'An error occurred while connecting to the MySQL db:\n' + error.stack
      })
    }
    else
    {
      if(results.length > 0){
        console.log(results);
        const comparision = await bcrypt.compare(password, results[0].pwd)
        if(comparision){
          exports.email = email;
          console.log("This is the username in users:", exports.email);
          res.render('user_home', {email: email, list: list});
        }
        else{
          res.send({
               'code':204,
               'success':'Invalid email and password'
          })
        }
      }
      else{
        res.send({
          'code':206,
          'success':'Unregistered email entered'
            });
      }
    }
  });
}
// router.post('/register', register);
// router.post('/login', login);
// module.exports = router;