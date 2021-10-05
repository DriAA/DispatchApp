const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { isLoggedIn, validateCompany, validateLoad } = require('../utils/middleware');
const router = express.Router();
const middleware = require("../utils/middleware")
var axios = require('axios');


// ! Models
const User = require('../models/user')
const Company = require('../models/company')
const Load = require('../models/load');
const Broker = require('../models/broker');
const { findOne } = require('../models/user');
const load = require('../models/load');
const { response } = require('express');
const { doesNotMatch } = require('assert');
const { features } = require('process');

router.get('/api', (req, res) =>{
   return res.json({Greetings: "hello"})
})
router.get('/api/company/:companyID',async(req, res) =>{
    brokerName = req.params.name
    foundBroker = await Broker.findById({ _id: req.params.companyID })
    res.json(foundBroker)
})

router.get('/api/load/:loadID',async(req, res) =>{
    foundLoad = await Load.findById({ _id: req.params.loadID })
    return res.json(foundLoad)
})


//! Company CRUD
// Main
router.get('/', isLoggedIn, (req, res) => {

    res.render('application/index', {selectedCompany: false})
})
// Create
router.get('/:companyID/new', isLoggedIn, validateCompany, async (req, res, next) => {
    return res.render('application/new', { selectedCompany })
});
router.post('/:companyID/new', isLoggedIn, validateCompany, async (req, res, next) => {
    // Save Company to DataBase and User
    let foundUser = await User.findById({ _id: loggedUser._id })
    let newCompany = new Company(req.body.company)
    newCompany.save()
    foundUser.company.push({ id: newCompany._id })
    foundUser.save()
    return res.redirect(`/app/${newCompany._id}`)
})
// Read
router.get('/:companyID', isLoggedIn, validateCompany, async (req, res, next) => {
    return res.render('application/show', { selectedCompany })
});
// Update
router.get('/:companyID/edit', isLoggedIn, validateCompany, async (req, res) => {
    return res.render('application/edit', { selectedCompany })
})
router.put("/:companyID/edit", isLoggedIn, validateCompany, async (req, res) => {
    let updatedCompany = await Company.findByIdAndUpdate({ _id: req.params.companyID }, { ...req.body.company })
    req.flash('success', 'Company Has Been Updated!!')
    res.redirect(`/app/${updatedCompany._id}`)
})
// Destroy
router.delete("/:companyID", isLoggedIn, validateCompany, async (req, res) => {
    for (let i = 0; i < selectedCompany.load.length; i++) {
        // Delete Company from DB.
        await Load.findByIdAndDelete({ _id: selectedCompany.load[i].id._id })
    }

    // Delete Company from users List.
    userCompanies = req.user.company
    for (let i = 0; i < userCompanies.length; i++) {
        if (userCompanies[i].id.toString() == req.params.companyID) {
            await User.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(loggedUser._id) },
                { $pull: { 'company': loggedUser.company[i] } }
            )

        }
    }
    // Delete Company from DB.
    await Company.findByIdAndDelete({ _id: req.params.companyID })
    // Find Newupdated User.
    UpdatedUser = await User.findById({ _id: loggedUser._id })
    UpdatedUser.company.length != 0 ?
        res.redirect(`/app/${UpdatedUser.company[0].id._id}`) :
        res.redirect('/auth/company')
})



// ! Load CRUD
// Main
router.get('/:companyID/load', isLoggedIn, validateCompany, async (req, res) => {
    res.json('Load Route has been Successfully Hit.')
})
// Create 
router.get('/:companyID/load/new', isLoggedIn, validateCompany, async (req, res) => {
    return res.render('load/new', { selectedCompany })
})
router.post('/:companyID/load/new', isLoggedIn, validateCompany, async (req, res) => {
    // Map Box API
    // https://api.mapbox.com/geocoding/v5/mapbox.places/Tampa,%20Florida.json?&access_token=pk.eyJ1Ijoib2xpdmVvaWx6IiwiYSI6ImNrcHEwbnNncTA4cDYyb2xlcWkxaHV3YW8ifQ.3C8_2v2XELxosKAN472hkA
    let load = req.body.load
    let stops = req.body.load.stop
    for (let i = 0; i < stops.length; i++) {

        pickup = `${stops[i].pickup.city}, ${stops[i].pickup.state}`
        delivery = `${stops[i].delivery.city}, ${stops[i].delivery.state}`
        // set requests
        const pickupURL = axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${pickup}.json?&access_token=pk.eyJ1Ijoib2xpdmVvaWx6IiwiYSI6ImNrcHEwbnNncTA4cDYyb2xlcWkxaHV3YW8ifQ.3C8_2v2XELxosKAN472hkA`);
        const deliveryURL = axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${delivery}.json?&access_token=pk.eyJ1Ijoib2xpdmVvaWx6IiwiYSI6ImNrcHEwbnNncTA4cDYyb2xlcWkxaHV3YW8ifQ.3C8_2v2XELxosKAN472hkA`);
        await axios.all([pickupURL, deliveryURL]).then(axios.spread((...responses) => {
        const responseOne = responses[0]
        pickupGeometry = responseOne.data.features[0].geometry 
        const responseTwo = responses[1]
        deliveryGeometry = responseTwo.data.features[0].geometry 
        })).catch(errors => {
            res.json(errors)
        })
        load.stop[i].pickup.geometry = pickupGeometry
        load.stop[i].delivery.geometry = deliveryGeometry

       const routeURL = `https://api.mapbox.com/directions/v5/mapbox/driving/${load.stop[i].pickup.geometry.coordinates};${load.stop[i].delivery.geometry.coordinates}?alternatives=false&geometries=geojson&steps=false&access_token=pk.eyJ1Ijoib2xpdmVvaWx6IiwiYSI6ImNrcHEwbnNncTA4cDYyb2xlcWkxaHV3YW8ifQ.3C8_2v2XELxosKAN472hkA`
        await axios.get(routeURL)
       .then((response) => {
            load.stop[i].route = {
                geometry: response.data.routes[0].geometry
            } 
       })
       .catch((error) => {
            res.status(404).json({error });
            // stop further execution in this callback
            return;
        })
    }  
    // Save Company to DataBase and User
    let foundCompany = await Company.findById({ _id: req.params.companyID })
    let newLoad = new Load(load)
    newLoad.save()
    foundCompany.load.push({ id: newLoad._id })
    foundCompany.save()

    return res.redirect(`/app/${foundCompany._id}/load/${newLoad._id}`)



})
//Read
router.get('/:companyID/load/:loadID', isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    return res.render('load/show', { selectedCompany, selectedLoad })
})
// Update
router.get('/:companyID/load/:loadID/edit', isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    return res.render('load/edit', { selectedCompany, selectedLoad })
})
router.put("/:companyID/load/:loadID/edit", isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    let updatedLoad = await Load.findByIdAndUpdate({ _id: req.params.loadID }, { ...req.body.load })
    req.flash('success', 'Load Has Been Updated!!')
    res.redirect(`/app/${req.params.companyID}`)
})
//  Delete
router.delete("/:companyID/load/:loadID", isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    for (let i = 0; i < selectedCompany.load.length; i++) {
        if (selectedCompany.load[i].id._id.toString() == req.params.loadID) {
            console.log("We Found a match!!")
            await Company.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(req.params.companyID) },
                { $pull: { 'load': selectedCompany.load[i] } }
            )
        }
    }
    // Delete Company from DB.
    await Load.findByIdAndDelete({ _id: req.params.loadID })

    // Find Newupdated User.
    UpdatedUser = await User.findById({ _id: loggedUser._id })
    res.redirect(`/app/${req.params.companyID}`)
})


// ! Broker Details
// Create
router.post('/:companyID/broker/new', isLoggedIn, validateCompany, async (req, res) => {
    // Save Broker to Account
    let foundCompany = await Company.findById({ _id: req.params.companyID })
    let newBroker = new Broker(req.body.broker)
    newBroker.save()
    foundCompany.broker.push({ id: newBroker._id })
    foundCompany.save()
    return res.redirect(`/app/${req.params.companyID}`) 
})

router.post('/:companyID/broker/:brokerID/edit', isLoggedIn, validateCompany, (req,res) =>{
    return res.json(req.body)
})












module.exports = router