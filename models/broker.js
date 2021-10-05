//  Require Dependencies.
const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema


// Create user schema w email.
const BrokerSchema = new Schema({
    name: String,
    email: String,
    tollFree: String,
    mc: String, 
    dot: String,
    billing: {
        address1: String,
        address2:String,
        city: String,
        state: String,
        postal: String
    },
    mobile: String,
    fax: String,
    website: String,
    note: String
});


// Export the user schema and model.
module.exports = mongoose.model("Broker", BrokerSchema);