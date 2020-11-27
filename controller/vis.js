const mysql = require("mysql");


// const db = mysql.createConnection({
//     host: process.env.NEW_DATABASE_HOST,
//     user: process.env.NEW_DATABASE_USER,
//     password: process.env.NEW_DATABASE_PASSWORD,
//     database: process.env.NEW_DATABASE
// });
const db  = mysql.createPool({
    connectionLimit : 1,
    host: process.env.NEW_DATABASE_HOST,
    user: process.env.NEW_DATABASE_USER,
    password: process.env.NEW_DATABASE_PASSWORD,
    database: process.env.NEW_DATABASE
});

exports.create = (req, res) => {

    var {data_column, vis_type, year} = req.body;
    console.log((year));
    const criteria = data_column.split(';');
    var query="";
    if(vis_type == 'map'){
        if(typeof(year) == 'string'){
            query = 'select latitude as lat, longitude as lng, accident_time as time from accident where accident_index like \'' + year +'%\' and latitude IS NOT NULL;'
            year = [year];
        }
        else {
            res.render('index');
        }
    }
    else if (year == undefined){
        query = 'select b.' + criteria[0] + '_label, count(*) as count from ' + criteria[1] + ' as a,' + criteria[0] + ' as b where a.' + criteria[0] + '_id = b.' + criteria[0] + '_id group by a.' + criteria[0] + '_id;';
        year = ['all'];
    }
    else{
        query = 'select b.' + criteria[0] + '_label, substring(a.accident_index, 1, 4) as year, count(*) as count from ' + criteria[1] + ' as a,' + criteria[0] + ' as b where a.' + criteria[0] + '_id = b.' + criteria[0] + '_id group by a.' + criteria[0] + '_id, substring(a.accident_index, 1, 4);';
        if(typeof(year) == 'string'){
            year = [year];
        }
    }
    console.log(query);
    //const query = 'select b.' + criteria[0] + '_label, count(*) as count from ' + criteria[1] + ' as a,' + criteria[0] + ' as b where a.' + criteria[0] + '_id = b.' + criteria[0] + '_id group by a.' + criteria[0] + '_id;'
    db.query(query, (err, rows, fields) => {
    if (!err){
        console.log(JSON.parse(JSON.stringify(rows)));
        // module.exports = {data: JSON.parse(JSON.stringify(rows)), chart: vis_type};
        res.render('chart', {data: (JSON.stringify(rows)), chart: vis_type, label: criteria[0], year: (JSON.stringify(year)) });
    }
    else
        console.log(err);
    })

    // console.log(req.body);
}