const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    bio: String,
    skills: [String],
    location: String,
    image: String
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);
