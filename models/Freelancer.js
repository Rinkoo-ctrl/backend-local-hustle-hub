const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    bio: String,
    skills: [String],
    location: String,
    images: {
        type: [String],
        default: ['https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/626fd8140423801.6241b91e24d9c.png']
    }
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);
