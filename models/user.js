//  Require Dependencies.
const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');



// Create user schema w email.
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    company:[
        {
            id:{
                type: Schema.Types.ObjectId,
                ref: 'Company'
            }
        }
    ]
    
});


// Plug in the username, password.
UserSchema.plugin(passportLocalMongoose);



// Export the user schema and model.
module.exports = mongoose.model("User", UserSchema);