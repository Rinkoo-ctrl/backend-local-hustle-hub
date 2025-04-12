const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    bio: String,
    skills: [String],
    locations: [
        {
            address: { type: String, required: true },
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model('Freelancer', freelancerSchema);
