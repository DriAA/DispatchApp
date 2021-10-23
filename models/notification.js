//  Require Dependencies.
const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const Schema = mongoose.Schema


// Create user schema w email.
const Notificationschema = new Schema({
    company:{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            require: True
        }
    },
    load: {
        type: Schema.Types.ObjectId,
        ref: 'Load',
        require: false
    },
    category:{
        type: String,
        "unum": ["noBroker","noDriverAssign", "missingDriverInfo", "missingLoadInfo,"]
    },
    message: String

});


// Export the user schema and model.
module.exports = mongoose.model("Notification", Notificationschema);