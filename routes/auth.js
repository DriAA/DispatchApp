// Dependencies
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser')
const router = express.Router();
const middleware = require("../utils/middleware")
const User = require('../models/user')
const Company = require('../models/company')
const Load = require('../models/load')
const Broker = require('../models/broker')
const Driver = require('../models/driver')



router.get('/login',(req,res, next) =>{
    res.render('auth/login')
})
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: "/auth/login" }), (req, res) => {
    req.flash('success', 'welcome back')
    const redirectUrl = req.session.returnTo || `/app/`;
    return res.redirect(redirectUrl);
})
router.get("/register", (req, res, next) => {
    res.render('auth/register')
})
router.post('/register', async (req, res) => {
    try {
        // Create model instance.
        const { email, username, password } = req.body;
        // Create new user from user model with username and password from register post route.
        const user = new User({ email, username })
        // creates new user into data base
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/auth/company')
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect('/register')
    }
})
router.get('/company', middleware.isLoggedIn, (req, res, next) => {
    res.render('auth/company')
})
router.post('/company', middleware.isLoggedIn, async (req, res, next) => {
    let foundUser = await User.findById({ _id: req.user._id })
    let newCompany = new Company(req.body.company)
    newCompany.save()
    foundUser.company.push({ id: newCompany._id })
    foundUser.save()
    res.redirect(`/app/${newCompany._id}`)
})
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Successfully Logged Out!');
    res.redirect('/auth/login');
})
router.post('/reset', async (req, res) => {
    await User.deleteMany({}).then(function () {
        console.log("All Users deleted"); // Success
    }).catch(function (error) {
        console.log(error); // Failure
    });
    await Company.deleteMany({}).then(function () {
        console.log("All Companies deleted"); // Success
    }).catch(function (error) {
        console.log(error); // Failure
    });
    await Load.deleteMany({}).then(function () {
        console.log("All Loads deleted"); // Success
    }).catch(function (error) {
        console.log(error); // Failure
    });

    await Broker.deleteMany({}).then(function () {
        console.log("All Brokers deleted"); // Success
    }).catch(function (error) {
        console.log(error); // Failure
    });

    await Driver.deleteMany({}).then(function () {
        console.log("All Driver deleted"); // Success
    }).catch(function (error) {
        console.log(error); // Failure
    });

    req.flash('success', 'Everything Has Been Deleted!');
    res.redirect('/auth/login')
})












module.exports = router