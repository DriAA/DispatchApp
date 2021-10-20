// ! Models
const User = require('../models/user')
const Company = require('../models/company')
const Load = require('../models/load')

module.exports = {
    isLoggedIn: async (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'You Must be Logged in firsted!')
            return res.redirect('/auth/login')
        }
        loggedUser = await User.findOne({ _id: req.user._id }).populate('company.id')
        next()
    },

    validateCompany: async (req, res, next) => {
        if (loggedUser.company.length != 0) {
            userCompanies = loggedUser.company
            for (let company of userCompanies) {
                if (company.id._id.toString() == req.params.companyID) {
                    selectedCompany = await Company.findById(company.id).populate('load.id').populate('broker.id').populate('driver.id')
                    return next()
                }
            }
            req.flash('error', `Could not find ${req.params.companyID}`)
            return res.redirect(`/app/${loggedUser.company[0].id._id}`)
        } else {
            // If User does not have any Companies in the Database.
            req.flash('error', 'You have not created a company yet!')
            return res.redirect('/auth/company')
        }
    },

    validateLoad: async (req, res, next) => {
        for (let load of selectedCompany.load) {
            if (load.id._id.toString() == req.params.loadID) {
                selectedLoad = await Load.findById(req.params.loadID).populate('broker.id')
                return next()
            }
        }
        req.flash('error', `Could not find load: ${req.params.loadID}`)
        return res.redirect(`/app/${req.params.companyID}`)
    }
}


