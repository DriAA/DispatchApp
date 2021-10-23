//  Require Dependencies.
const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const Schema = mongoose.Schema


// Create user schema w email.
const Loadschema = new Schema({

    loadID: String,
    loadPO: String,
    broker: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Broker'
        },
        name: String
    },
    dates:{
        pickup: String, 
        delivery: String 
    },
    rate: String,
    commodity: String,
    weight: String,
    driver: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Driver',
            require: false
        },
        firstName: String, 
        lastName: String

    },
    miles: String,
    type: String,
    stop: [
        {
            pickup: {
                city: String,
                state: String,
                geometry: {
                    type: {
                        type: String, // Don't do `{ location: { type: String } }`
                        enum: ['Point'], // 'location.type' must be 'Point'
                        required: true
                    },
                    coordinates: {
                        type: [Number],
                        required: true
                    }
                }
            },
            delivery: {
                city: String,
                state: String,
                geometry: {
                    type: {
                        type: String, // Don't do `{ location: { type: String } }`
                        enum: ['Point'], // 'location.type' must be 'Point'
                        required: true
                    },
                    coordinates: {
                        type: [Number],
                        required: true
                    }
                }
            },
            route: {
                geometry: {
                    coordinates: {
                        type: [[Number]], // Array of arrays of arrays of numbers
                        required: true
                    },
                    type: {
                        type: String,
                        enum: ['LineString'],
                        required: true
                    },
                }
            }
        }

    ],
    note: String,
    postCreated: String,
    postViewed: String,
    postEdited: String
});


// Export the user schema and model.
module.exports = mongoose.model("Load", Loadschema);