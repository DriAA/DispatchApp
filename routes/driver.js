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
router.get('/', isLoggedIn, validateCompany, async (req, res, next) => {
    res.render('driver/index',{selectedCompany})
});

router.get('/:item', isLoggedIn, validateCompany, async (req, res, next) => {
    return res.json(`Welcome to the Driver Router, Displaying: ${req.params.item}`)
});


module.exports = router