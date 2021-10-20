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


//! CRUD - Finance
// Create
router.get('/new',isLoggedIn, validateCompany, async (req, res, next) =>{
    res.render('driver/new', {selectedCompany})
})

// Read
router.get('/', isLoggedIn, validateCompany, async (req, res, next) => {
    res.render('driver/index',{selectedCompany})
});

router.get('/:item', isLoggedIn, validateCompany, async (req, res, next) => {
    return res.json(`Welcome to the Driver Router, Displaying: ${req.params.item}`)
});


module.exports = router