const Freelancer = require('../models/Freelancer');

exports.createOrUpdateFreelancer = async (req, res) => {
    const { name, bio, skills, location, images } = req.body;
    try {
        const userId = req.user.id;
        const profile = await Freelancer.findOneAndUpdate(
            { userId },
            { name, bio, skills, location, images },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error saving profile', error: err });
    }
};

exports.getFreelancerById = async (req, res) => {
    try {
        const profile = await Freelancer.findById(req.params.id);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err });
    }
};
