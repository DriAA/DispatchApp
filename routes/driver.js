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
    foundCompany.driver.push({id: newDriver._id})
    foundCompany.save()
    return res.redirect(`/app/${req.params.companyID}/driver`) 
})

// Read
router.get('/:driverID', isLoggedIn, validateCompany, async (req, res, next) => {
    let selectedDriver = await Driver.findById({_id: req.params.driverID})
    res.render('driver/show', {selectedDriver,selectedCompany})
});

// Update
router.get('/:driverID/edit',isLoggedIn, validateCompany, async (req, res, next) =>{
    let selectedDriver = await Driver.findById({_id: req.params.driverID})
    res.render('driver/edit', {selectedCompany, selectedDriver})
})
router.put("/:driverID/edit", isLoggedIn, validateCompany, async (req, res) => {
    let selectedDriver = await Driver.findByIdAndUpdate({_id: req.params.driverID},{...req.body.driver})
    selectedDriver.save()
    res.redirect(`/app/${req.params.companyID}/driver/${req.params.driverID}`)
})

// Delete
router.delete('/:driverID', isLoggedIn, validateCompany, async (req, res, next)=>{
    for (let i = 0; i < selectedCompany.driver.length; i++) {
        if (selectedCompany.driver[i].id._id.toString() == req.params.driverID) {
            console.log("We Found a match!!")
            await Company.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(req.params.companyID) },
                { $pull: { 'driver': selectedCompany.driver[i] } }
            )
        }
    }
    // Delete Company from DB.
    await Driver.findByIdAndDelete({ _id: req.params.driverID })
    // Find Newupdated User.
    UpdatedUser = await User.findById({ _id: loggedUser._id })
    res.redirect(`/app/${req.params.companyID}`)
})



module.exports = router