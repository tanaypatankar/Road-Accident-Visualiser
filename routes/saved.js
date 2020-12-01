var mysql = require('mysql');
const user = require("../routes/users.js");
const db  = mysql.createPool({
    connectionLimit : 1,
    host: process.env.NEW_DATABASE_HOST,
    user: process.env.NEW_DATABASE_USER,
    password: process.env.NEW_DATABASE_PASSWORD,
    database: process.env.NEW_DATABASE
    });

function savevis(req, res)
{
    console.log("savevis called from saved.js");
    console.log(req.body.savevisbutton);
    var body = JSON.parse(req.body.savevisbutton);
    // var body = ;
    var email = user.email;
    var saved_data =
    {
        'data_to_vis': body.data_column,
        'years': body.year,
        'type_of_graph': body.vis_type,
        'user_email': email
    }
    console.log(saved_data);
    db.query('SELECT * FROM saved WHERE user_email = ? and data_to_vis = ? and years = ? and type_of_graph = ?;',
    [saved_data.email, saved_data.data_to_vis, saved_data.years, saved_data.type_of_graph], async function (error, results, fields) {
        if(error){
        console.log(error);
        }
        else{
        if(results.length != 0)
        {
            // window.alert("Visualisation already saved.");
            console.log("Visualisation already saved");
            res.redirect('/user_home');
        }
        else{
            db.query('INSERT INTO saved SET ?', saved_data, function (error, results, fields) {
            if (error) 
            {
                // window.alert("An error occurred.");
                console.log(error);
            }
            else
            {
                // window.alert("Visualisation saved!");
                console.log("Visualisation saved");
                res.redirect('/user_home');
            }
            });
        }
        }
    });
}

exports.save = savevis;