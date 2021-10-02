const mongoose = require("mongoose");
const validator = require("validator");

const AccountSchema = new mongoose.Schema({
    
        //country:{
          //  type: String, 
           // required:true
        //},
        fname: {
            type: String,
            //required: true
        },
        lname: {
            type: String,
            //required: true
        },
        email: {
            type: String,
            //required: true,
            //index: { unique: true},
            //validate: [validator.isemail, 'Invalid email'],
        },
        password: {
            type: String,
            //required: true,
            minlength: 8
        },
        conpass: {
            type: String,
            //required: true,
            minlength: 8
        },
        address: {
            type: String,
            //required: true
        },
        city: {
            type: String,
            //required: true
        },
        state: {
            type: String,
            //required: true
        },
        zip:  {
            type: Number,
            maxlength: 12
        },
        number: {
            type: Number,
            maxlength: 11
              
        }
    }
)

module.exports = mongoose.model("login", AccountSchema)
