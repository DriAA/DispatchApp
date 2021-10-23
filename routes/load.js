const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { isLoggedIn, validateCompany, validateLoad } = require('../utils/middleware');
const router = express.Router({ mergeParams: true });
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


// ! Load CRUD
// Main
router.get('/', isLoggedIn, validateCompany, async (req, res) => {
    return res.render('load/index', { selectedCompany })
})
// Create 
router.get('/new', isLoggedIn, validateCompany, async (req, res, next) => {
    return res.render('load/new', { selectedCompany })
})
router.post('/new', isLoggedIn, validateCompany, async (req, res, next) => {
    // Map Box API
    // https://api.mapbox.com/geocoding/v5/mapbox.places/Tampa,%20Florida.json?&access_token=pk.eyJ1Ijoib2xpdmVvaWx6IiwiYSI6ImNrcHEwbnNncTA4cDYyb2xlcWkxaHV3YW8ifQ.3C8_2v2XELxosKAN472hkA
    let load = req.body.load
    load.postCreated = new Date().toLocaleString();
    let foundBroker = await Broker.findById(req.body.load.broker.id)
    load.broker.name = foundBroker.name
    let stops = req.body.load.stop

    if(req.body.load.driver.id == 'undecided'){
        console.log('No Driver Selected');
        load.driver.id = null
    }

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
                res.status(404).json({ error });
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
router.get('/:loadID', isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    let load = await Load.findById({ _id: req.params.loadID }).populate('broker.id').populate('driver.id')
    load.postViewed = new Date().toLocaleString();
    load.save
    return res.render('load/show', { selectedCompany, selectedLoad: load })
})
// Update
router.get('/:loadID/edit', isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    return res.render('load/edit', { selectedCompany, selectedLoad })
})
router.put("/:loadID/edit", isLoggedIn, validateCompany, validateLoad, async (req, res) => {
    let load = req.body.load
    load.postEdited = new Date().toLocaleString();

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
                res.status(404).json({ error });
                // stop further execution in this callback
                return;
            })
    }

    let updatedLoad = await Load.findByIdAndUpdate({ _id: req.params.loadID }, { ...load })

    req.flash('success', 'Load Has Been Updated!!')
    res.redirect(`/app/${req.params.companyID}`)
})
//  Delete
router.delete("/:loadID", isLoggedIn, validateCompany, validateLoad, async (req, res) => {
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










module.exports = router