var express = require('express');
var router = express.Router();
const db = require('../model/helper');
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const GOOGLE_API_KEY = process.env.REACT_APP_PLACE_API_KEY;

//Get all ServiceProviders
router.get('/', function (req, res, next) {
    db(`SELECT * FROM serviceProviders;`)
        .then(result => {
            res.send(result.data)
        })
        .catch(err => res.status(500).send(err))
});


//Get all ServiceTypes
router.get('/servicetype', function (req, res, next) {
    db(`SELECT * FROM serviceType;`)
        .then(result => {
            // console.log(result.data);
            res.status(200).send(result.data);
        })
        .catch(err => res.status(500).send(err))
});

// Get ServiceProvider from Type and locality
router.get('/servicebyidandloc/:serviceTypeID/:placeID', async function (req, res, next) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.placeID}&fields=geometry,formatted_address,address_component&key=${process.env.GOOGLE_PLACES_KEY}`);
    const json = await response.json();
    let placeDetails = {
        locality: json.result.address_components[1].long_name,
    }
    db(`select sp_id, service as 'service_type', price, loc_description, loc_lat, loc_lng, loc_locality, description, serviceProviders.u_id as 'service_owner_id', displayName as 'service_owner', profile_img from (serviceProviders inner join users on serviceProviders.u_id = users.u_id) inner join serviceType on serviceProviders.st_id = serviceType.st_id where serviceProviders.st_id=${req.params.serviceTypeID} and loc_locality="${placeDetails.locality}" and availability=TRUE;`)
        .then(result => {
            // console.log(result.data);
            res.status(200).send(result.data);
        })
        .catch(err => res.status(500).send(err))
});

router.post('/add', async function (req, res, next) {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.place_id}&fields=geometry,formatted_address,address_component&key=${process.env.GOOGLE_PLACES_KEY}`);
    const json = await response.json();
    console.log(json)
    let placeDetails = {
        locality: json.result.address_components[1].long_name,
        full_address: json.result.formatted_address,
        lat: json.result.geometry.location.lat,
        lng: json.result.geometry.location.lng
    }
    // console.log(placeDetails);
    db(`insert into serviceProviders(u_id,st_id,price,description, availability, loc_description, loc_lat,loc_lng,loc_locality) values(${req.body.u_id}, ${req.body.st_id}, ${req.body.price}, "${req.body.description}", ${req.body.availability}, '${placeDetails.full_address}', '${placeDetails.lat}', '${placeDetails.lng}', '${placeDetails.locality}');`)
        .then(result => {
            console.log(result.data);
            res.status(200).send(result.data);
        })
        .catch(err => res.status(500).send(err))
    // res.send(placeDetails);
});

router.post('/book', function (req, res){
    db(`insert into orders(u_id, sp_id, book_date, book_time) values(${req.body.u_id},${req.body.sp_id}, date("${req.body.book_date}"), time("${req.body.book_time}"));`)
        .then(result => {
            console.log(result.data);
            let fromUser = {}, toUser ={};
            db(`select * from users where u_id=${req.body.u_id} or u_id=${req.body.service_owner_id};`)
                .then(result => {
                    for(let user of result.data){
                        if (user.u_id == req.body.u_id) fromUser = user;
                        if (user.u_id == req.body.service_owner_id) toUser = user;
                    }
                    console.log(`To Email: ${toUser.email}`);
                    const msg = {
                        to: toUser.email,
                        from: 'nanette@tayloredcode.com',
                        subject: 'Get It Done - Service Booking',
                        text: 'and easy to do anywhere, even with Node.js',
                        html: `<div><h3>Hello ${toUser.displayName},</h3><p>${fromUser.displayName} would like to book your services on ${req.body.book_date} at ${req.body.book_time}. ${fromUser.displayName} can be contacted at ${fromUser.email}</p><p>Get It Done!!</p></div>`,
                    };
                    try{
                        sgMail.send(msg);
                    }catch(err){console.log(err)}
                }).catch(err => console.log(err))
            res.status(201).send(result.data);
        })
        .catch(err => res.status(500).send(err))
});

// router.post('/uploadImg', function (req, res){
//   db(`insert into images(u_id, image) values(${req.body.u_id},"${req.body.image}");`)
//       .then(result => {
//           console.log(result.data);
//           res.status(201).send(result.data);
//       })
//       .catch(err => res.status(500).send(err))
// });

//GET booking-history
router.get('/booking-history/:id', function(req, res){
    db(`select serviceType.st_id as 'st_id', displayName as 'service_owner', service, description, loc_description, price, book_time, book_date, date(order_date) as 'history_date', time(order_date) as 'history_time' from (orders inner join serviceProviders on orders.sp_id = serviceProviders.sp_id) inner join users on serviceProviders.u_id = users.u_id inner join serviceType on serviceProviders.st_id = serviceType.st_id where orders.u_id =${req.params.id};`)
        .then(result => {
            res.status(200).send(result.data);
        })
        .catch(err => res.status(500).send(err))
});

module.exports = router;