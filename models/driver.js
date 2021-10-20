//  Require Dependencies.
const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema


// Create user schema w email.
const DriverSchema = new Schema({
    firstName: String,
    lastName: String,
    DOB: String,
    image: String,
    mobile: String,
    email: String,
    address:{
        address1: String,
        address2: String,
        city: String,
        state: String,
        postal: String,
        country: String
    },
    liscenseNumber: String,
    employeeNumber: String,
    truck: {
        number: String
    },
    trailer: {
        equipment: String, 
        number: String
    },
    joinedCompany: String

});


// Export the user schema and model.
module.exports = mongoose.model("Driver", DriverSchema);