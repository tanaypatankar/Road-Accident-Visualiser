//GLOBAL VAR
var acc_idx, no_casualties, no_vehicles; 

//MYSQL STUFF
const mysql = require('mysql');
//CONNECT TO THE
const db  = mysql.createPool({
    connectionLimit : 1,
    host: process.env.NEW_DATABASE_HOST,
    user: process.env.NEW_DATABASE_USER,
    password: process.env.NEW_DATABASE_PASSWORD,
    database: process.env.NEW_DATABASE
});
// CONNECTION FROM THE WEBSITE
// TO THE DATABASE  
exports.register = (req, res) => {
    console.log(req.body); 
    const year_id = req.body.year_id; 
    const accident_index = year_id*1000000 + Math.floor((Math.random() * 1000000) + 1);
    const { longitude, latitude, accident_severity_id, num_vehicles, num_casualty, accident_date, day_of_week_id, accident_time, road_type_id, speed_limit, junction_detail_id, junction_control_id, light_conditions_id, weather_conditions_id, road_surface_conditions_id, special_conditions_id, carriageway_hazards_id, urbal_or_rural_id, police_at_scene_id } = req.body; 
    
    acc_idx=accident_index; 
    no_casualties= num_casualty; 
    no_vehicles = num_vehicles; 

    db.query("SELECT accident_index FROM accident WHERE accident_index = ?", [accident_index], (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('add', {
                message: "THAT INDEX WAS USED BEFORE", 
            }); 
        }
    }); 

    db.query("INSERT INTO accident SET ? ", { accident_index:accident_index, longitude:longitude , latitude:latitude, accident_severity_id:accident_severity_id, num_vehicles:num_vehicles, num_casualty:num_casualty, accident_date:accident_date, day_of_week_id:day_of_week_id, accident_time:accident_time, road_type_id:road_type_id, speed_limit:speed_limit, junction_detail_id:junction_detail_id, junction_control_id:junction_control_id, light_conditions_id:light_conditions_id, weather_conditions_id:weather_conditions_id, road_surface_conditions_id:road_surface_conditions_id, special_conditions_id:special_conditions_id, carriageway_hazards_id:carriageway_hazards_id, urbal_or_rural_id:urbal_or_rural_id, police_at_scene_id:police_at_scene_id }, (error, results) => {
        if(error){
            console.log(error); 
        }
        else {
            if(no_casualties > 0 ){
                console.log("Adding Values for ", no_casualties, "/",  no_casualties,  "for Accident Index: ", acc_idx);
                return res.render('add_casualties'); 
            }
            else {
                return res.render('add_vehicles');
            }
            /*
            for(i = 0; i < no_casualties; i++){
                console.log("Adding Values for ", i+1, "/",  no_casualties,  "for Accident Index: ", acc_idx);
                return res.render('add_casualties'); 
            }
            for(i = 0; i < no_vehicles; i++){
                console.log("Adding Values for ", i+1, "/",  no_vehicles,  "for Accident Index: ", acc_idx);
                return res.render('add_vehicles'); 
            }*/
        }
    });  
};

exports.add_casualties = (req, res) => {
    console.log(req.body); 
    casualty_id = 0;
    const{ casualty_class_id, gender_id, age_casualty, age_band_driver_id,casualty_severity_id,  ped_location_id, ped_movement_id, car_passenger_id, bus_passenger_id, ped_road_maint_worker_id, casualty_type_id, home_area_type_id } = req.body; 

    db.query("INSERT INTO casualty SET ? ", { casualty_id: casualty_id, accident_index:acc_idx,casualty_class_id: casualty_class_id, gender_id: gender_id, age_casualty: age_casualty,age_band_driver_id:age_band_driver_id,casualty_severity_id:casualty_severity_id,  ped_location_id:ped_location_id, ped_movement_id:ped_movement_id, car_passenger_id:car_passenger_id, bus_passenger_id:bus_passenger_id, ped_road_maint_worker_id:ped_road_maint_worker_id, casualty_type_id:casualty_type_id, home_area_type_id:home_area_type_id }, (error, results) => {
        if(error){
            console.log(error); 
        }
        else {
            no_casualties--; 
            if(no_casualties != 0) {
                //console.log("Adding Values for ", no_casualties-i-1, "/",  no_casualties,  "for Accident Index: ", acc_idx);
                return res.render('add_casualties'); 
            }
            else{                
                return res.render('add_vehicles'); 
            }
        }
    });  
};

exports.add_vehicles = (req, res) => {
    console.log(req.body); 
    vehicle_id = 0;
    const{ vehicle_type_id, towing_id, vehicle_manoeuvre_id,vehicle_location_id, junction_location_id, skidding_id, hit_object_id, point_of_impact_id, left_hand_drive_id, journey_purpose_id, gender_id, age_driver, age_band_driver_id, engine_capacity,vehicle_propulsion_id, vehicle_age, home_area_type_id  } = req.body; 

    db.query("INSERT INTO vehicle SET ? ", { vehicle_id: vehicle_id, accident_index:acc_idx, vehicle_type_id:vehicle_type_id, towing_id:towing_id, vehicle_manoeuvre_id:vehicle_manoeuvre_id,vehicle_location_id:vehicle_location_id, junction_location_id:junction_location_id, skidding_id:skidding_id, hit_object_id:hit_object_id, point_of_impact_id:point_of_impact_id, left_hand_drive_id:left_hand_drive_id, journey_purpose_id:journey_purpose_id, gender_id:gender_id, age_driver:age_driver, age_band_driver_id:age_band_driver_id, engine_capacity:engine_capacity,vehicle_propulsion_id:vehicle_propulsion_id, vehicle_age:vehicle_age, home_area_type_id:home_area_type_id  }, (error, results) => {
        if(error){
            console.log(error); 
        }
        else {
            no_vehicles--; 
            if(no_vehicles != 0) {
                console.log("Adding Values for Accident Index: ", acc_idx);
                return res.render('add_vehicles'); 
            }
            else{                
                return res.render('idx'); 
            }
        }
    });  
}