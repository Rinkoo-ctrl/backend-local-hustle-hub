const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
    title: String,
    description: String,
    price: Number,
    category: String
});

module.exports = mongoose.model('Service', ServiceSchema);
    