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
        'years': (JSON.stringify(body.year) == undefined) ? 'all' : JSON.stringify(body.year),
        'type_of_graph': body.vis_type,
        'user_email': email
    }
    console.log(saved_data);
    db.query('SELECT * FROM saved WHERE user_email = ? and data_to_vis = ? and years = ? and type_of_graph = ?;',
    [saved_data.user_email, saved_data.data_to_vis, saved_data.years, saved_data.type_of_graph], async function (error, results, fields) {
        if(error){
            console.log(error);
        }
        else{
            console.log(results.length);
            if(results.length != 0)
            {
                console.log("Visualisation already saved");
                db.query('SELECT * FROM saved WHERE user_email = ?;', [saved_data.user_email], function (error, rows, fields){
                    var list;
                    if(error){
                        console.log(error);
                    }
                    else{
                        // console.log(rows);
                        list = JSON.parse(JSON.stringify(rows));
                        // console.log(list);
                    }
                    res.render('user_home', {email: saved_data.user_email, list: list});
                })
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
                    db.query('SELECT * FROM saved WHERE user_email = ?;', [saved_data.user_email], function (error, rows, fields){
                        var list;
                        if(error){
                            console.log(error);
                        }
                        else{
                            // console.log(rows);
                            var list = JSON.parse(JSON.stringify(rows));
                            // console.log(list);
                        }
                        res.render('user_home',  {email: saved_data.user_email, list: list});
                    })
                }
                });
            }
        }
    });
}

function opensavedvis(req, res)
{
    db.query('SELECT * FROM saved WHERE saved_id = ?;', [req.params.data], function (error, rows, fields){
        if(error){
            console.log(error);
        }
        else{
            // console.log(rows);
            var record = JSON.parse(JSON.stringify(rows));
            // console.log(record);
        }
        console.log(record);

        var email = record[0].user_email;
        // console.log(email);
        var data_column = record[0].data_to_vis;
        var vis_type = record[0].type_of_graph;
        var year = JSON.parse(record[0].years);

        // console.log((req.body));
        const criteria = data_column.split(';');

        var query="";
        if(vis_type == 'map')
        {
            if(typeof(year) == 'string')
            {
                query = 'select latitude as lat, longitude as lng, accident_time as time from accident where accident_index like \'' + year +'%\' and latitude IS NOT NULL;'
                year = [year];
            }
            else 
            {
                res.render('index');
            }
        }
        else if (year == undefined || year == null)
        {
            query = 'select b.' + criteria[0] + '_label, count(*) as count from ' + criteria[1] + ' as a,' + criteria[0] + ' as b where a.' + criteria[0] + '_id = b.' + criteria[0] + '_id group by a.' + criteria[0] + '_id;';
            year = ['all'];
        }
        else
        {
            query = 'select b.' + criteria[0] + '_label, substring(a.accident_index, 1, 4) as year, count(*) as count from ' + criteria[1] + ' as a,' + criteria[0] + ' as b where a.' + criteria[0] + '_id = b.' + criteria[0] + '_id group by a.' + criteria[0] + '_id, substring(a.accident_index, 1, 4);';
            if(typeof(year) == 'string')
            {
                year = [year];
            }
        }
        // console.log(query);
        db.query(query, (err, rows, fields) => {
        if (!err)
        {
            res.render('openvis', {data: (JSON.stringify(rows)), chart: vis_type, label: criteria[0], year: (JSON.stringify(year)), email: email, body: JSON.stringify(req.body)});
        }
        else
            console.log(err);
        })


        // res.render('openvis.hbs', {data:req.params['data']})
    })
}

function deletevis(req, res){
    db.query('DELETE FROM saved WHERE saved_id = ?;', [req.params.data], function (error, rows, fields){
        if(error){
            console.log(error);
        }
        else{
            db.query('SELECT * FROM saved WHERE user_email = ?;', [user.email], function (error, rows, fields){
                var list;
                if(error){
                    console.log(error);
                }
                else{
                    // console.log(rows);
                    var list = JSON.parse(JSON.stringify(rows));
                    // console.log(list);
                }
                res.render('user_home',  {email: user.email, list: list});
            })
        }
    })
}

exports.save = savevis;
exports.open = opensavedvis;
exports.delete = deletevis;