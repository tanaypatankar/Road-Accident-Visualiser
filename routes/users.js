var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const router = express.Router();
const db  = mysql.createPool({
  connectionLimit : 1,
  host: process.env.NEW_DATABASE_HOST,
  user: process.env.NEW_DATABASE_USER,
  password: process.env.NEW_DATABASE_PASSWORD,
  database: process.env.NEW_DATABASE
});

async function register(req,res)
{
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)

  var users={
     'email': req.body.email,
     'password': encryptedPassword
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
            module.exports.user = users.email;
            res.render('user_home', {email: users.email});
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
      if(results.length  >0){
        console.log(results);
        const comparision = await bcrypt.compare(password, results[0].password)
        if(comparision){
          module.exports.user = email;
          res.render('user_home', {email: email});
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
router.post('/register', register);
router.post('/login', login);
module.exports = router;
