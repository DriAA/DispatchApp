const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const { isLoggedIn, validateCompany, validateLoad, createNotifications } = require('../utils/middleware');
const router = express.Router({mergeParams: true});
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
    foundBroker = await Broker.findById({ _id: req.params.companyID })
    res.json(foundBroker)
})

router.get('/api/finance/:companyID',async(req, res) =>{
    foundCompany = await Company.findById({ _id: req.params.companyID }).populate('load.id').populate('driver.id')
    return res.json(foundCompany)
})

router.get('/api/load/:loadID',async(req, res) =>{
    foundLoad = await Load.findById({ _id: req.params.loadID })
    return res.json(foundLoad)
})

// Routers
const loadRoute = require('./load')
const financeRoute = require('./finance')
const driverRoute = require('./driver')
const notificationRoute = require('./notification')
const brokerRoute = require('./broker')


router.use('/:companyID/load',loadRoute)
router.use('/:companyID/finance',financeRoute)
router.use('/:companyID/driver',driverRoute)
router.use('/:companyID/notification',notificationRoute)
router.use('/:companyID/broker',brokerRoute)



// Main
router.get('/', isLoggedIn, (req, res) => {
    res.render('application/all', {selectedCompany: false})
})



// CRUD - COMPANY
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
router.get('/:companyID', isLoggedIn, validateCompany, createNotifications,  async (req, res, next) => {
        let notifications = (res.notifications.total != 0 ? res.notifications : false)
        let finance = {sum:0}
        let totalSum = 0;
        for (let load of selectedCompany.load){
            totalSum = totalSum + parseFloat(load.id.rate)
            finance.sum = totalSum
        }
          
        console.log('res.notifications: ', res.notifications.total)
        console.log('Notifications: ', notifications)
   

    return res.render('application/index', { selectedCompany, finance, notifications})
    
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



module.exports = router