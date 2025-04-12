const Freelancer = require('../models/Freelancer');

exports.createOrUpdateFreelancer = async (req, res) => {
    const { name, bio, skills, locations } = req.body;

    try {
        const userId = req.user.id;
        const location = locations[0];

        if (!location || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({ message: "Invalid location format." });
        }

        const address = location.address;
        const longitude = location.coordinates[0];
        const latitude = location.coordinates[1];

        const profile = await Freelancer.findOneAndUpdate(
            { userId },
            {
                name,
                bio,
                skills,
                address,
                latitude,
                longitude
            },
            { new: true, upsert: true }
        );

        res.json(profile);
    } catch (err) {
        console.error(err);
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
