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
const Driver = require('../models/driver')

const { findOne } = require('../models/user');
const load = require('../models/load');
const { response } = require('express');
const { doesNotMatch } = require('assert');
const { features } = require('process');


//! CRUD - Driver

// Show
router.get('/', isLoggedIn, validateCompany, async (req, res, next) => {
    res.render('driver/index',{selectedCompany})
});

// Create
router.get('/new',isLoggedIn, validateCompany, async (req, res, next) =>{
    res.render('driver/new', {selectedCompany})
})

router.post('/new', isLoggedIn, validateCompany, async (req, res) =>{
    let foundCompany = await Company.findById({_id: req.params.companyID})
    let newDriver = new Driver(req.body.driver)
    newDriver.save()
    console.log("New Driver: ", newDriver)
    foundCompany.driver.push({id: newDriver._id})
    foundCompany.save()
    return res.redirect(`/app/${req.params.companyID}/driver`) 
})

// Read
router.get('/:driverID', isLoggedIn, validateCompany, async (req, res, next) => {
    let foundDriver = await Driver.findById({_id: req.params.driverID})
    return res.json(foundDriver)
});

// Update
router.get('/:driverID/edit',isLoggedIn, validateCompany, async (req, res, next) =>{
    let selectedDriver = await Driver.findById({_id: req.params.driverID})
    res.render('driver/edit', {selectedCompany, selectedDriver})
})

router.put("/:driverID/edit", isLoggedIn, validateCompany, async (req, res) => {
    let selectedDriver = await Driver.findById({_id: req.params.driverID})
    res.json({"Editing Driver: ": selectedDriver})
})



module.exports = router