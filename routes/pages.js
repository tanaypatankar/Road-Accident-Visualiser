const express = require('express');
const router = express.Router();

// '/' directory of express
router.get('/', (req,res) => {
    // db.query('select b.skidding_label, count(*) as count from vehicle as a,skidding as b where a.skidding_id = b.skidding_id group by a.skidding_id;', (err, rows, fields) => {
    // if (!err){
    //     console.log(JSON.parse(JSON.stringify(rows)));
    // }
    // else
    //     console.log(err);
    // })
    res.render('index.hbs')
} );

module.exports = router;