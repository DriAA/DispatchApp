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


// ! Broker Details
// Show
router.get('/', isLoggedIn, validateCompany, async (req, res) =>{
    res.json("Show All Brokers.")
})


// Create
router.get('/new', isLoggedIn, validateCompany, async (req, res) =>{
    res.json("Lets Create a new Broker!")
})
router.post('/new', isLoggedIn, validateCompany, async (req, res) => {
    // Save Broker to Account
    let foundCompany = await Company.findById({ _id: req.params.companyID })
    let newBroker = new Broker(req.body.broker)
    newBroker.save()
    foundCompany.broker.push({ id: newBroker._id })
    foundCompany.save()
    return res.redirect(`/app/${req.params.companyID}`) 
})

router.post('/:brokerID/edit', isLoggedIn, validateCompany, (req,res) =>{
    return res.json(req.body)
})







module.exports = router