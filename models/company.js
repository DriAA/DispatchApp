//  Require Dependencies.
const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema


// Create user schema w email.
const CompanySchema = new Schema({
    name: String,
    mc: String, 
    dot: String,
    taxID: String,
    contact:{
        title: String,
        firstName: String,
        lastName: String,
        mobile: String,
        email: String
    },
    billing:{
        address1: String,
        address2: String,
        city: String, 
        state: String,
        postal: String,
        country: String
    },
    load:[
        {
            id:{
                type: Schema.Types.ObjectId,
                ref: 'Load'
            }
        }
    ],
    broker:[
        {
            id:{
                type: Schema.Types.ObjectId,
                ref: 'Broker'
            }
        }
    ],
    driver:[
        {
            id:{
                type: Schema.Types.ObjectId,
                ref: "Driver"
            }
        }
    ]
    
});


// Export the user schema and model.
module.exports = mongoose.model("Company", CompanySchema);