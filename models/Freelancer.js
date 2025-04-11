const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    bio: String,
    skills: [String],
    image: String,
    locations: [
        {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            },
            address: {
                type: String,
                required: true
            }
        }
    ]
});

FreelancerSchema.index({ "locations": "2dsphere" });

module.exports = mongoose.model('Freelancer', FreelancerSchema);
