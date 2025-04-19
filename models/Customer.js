const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    image: {
        type: String, 
        required: false,
        default: process.env.DEFAULT_IMAGE
    },
    address: {
        type: String,
        required: false,
    },
    gender:{
        type:String,
        required :false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Customer", customerSchema);
