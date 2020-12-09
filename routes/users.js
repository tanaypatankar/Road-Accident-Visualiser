var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db  = mysql.createPool({
  connectionLimit : 1,
  host: process.env.NEW_DATABASE_HOST,
  user: process.env.NEW_DATABASE_USER,
  password: process.env.NEW_DATABASE_PASSWORD,
  database: process.env.NEW_DATABASE
});

// var list = [{name: "harshad"}, {name: "harshad"}, {name: "harshad"}, {name: "tanay"}];
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
        res.render(
          'register',
          {error: "Email already exists."}
     );
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
  console.log(password);

  // To be copied wherever saved list is to be passed - START
  var list;
  db.query('SELECT * FROM saved WHERE user_email = ?;', [email],async function (error, rows, fields){
    if(error){
        console.log(error);
    }
    else{
        // return rows;
        list = JSON.parse(JSON.stringify(rows));
        // console.log(list);
    }
  })
  // To be copied wherever saved list is to be passed - END


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
          console.log(list);
          if(email == "harshad.gm@gmail.com" || email == "123@abc.com")
          res.render('user_home', {email: email, list: list, button: '<a href="/add" class="btn btn-primary" style="background-color:indigo;">Add Entries</a>'});
          else
          res.render('user_home', {email: email, list: list});
        }
        else{
          res.render(
               'login',
               {error: "Invalid email and password."}
          );
        }
      }
      else{
        res.render(
          'login',
          {error: "Unregistered email entered."}
     );
      }
    }
  });
}

function redirecthome(req, res)
{
  var email= req.body.email;
  console.log(email);
  var list;
  db.query('SELECT * FROM saved WHERE user_email = ?;', [email],async function (error, rows, fields){
    if(error){
        console.log(error);
    }
    else{
        // return rows;
        list = JSON.parse(JSON.stringify(rows));
        // console.log(list);
    }
  })
  // To be copied wherever saved list is to be passed - END


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
        exports.email = email;
        console.log("This is the username in users:", exports.email);
        console.log(list);
        if(email == "harshad.gm@gmail.com" || email == "123@abc.com")
        res.render('user_home', {email: email, list: list, button: '<a href="/add" class="btn btn-primary" style="background-color:indigo;">Add Entries</a>'});
        else
        res.render('user_home', {email: email, list: list});
      }
      else{
        res.render(
          'login',
          {error: "Unregistered email entered."}
     );
      }
    }
  });
}

exports.redirecthome = redirecthome;
exports.login = login;
exports.register = register;
