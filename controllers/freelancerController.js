const Freelancer = require('../models/Freelancer');

exports.createOrUpdateFreelancer = async (req, res) => {
    const { name, bio, skills, locations } = req.body;
    console.log(JSON.stringify(req.body))
    try {
        const userId = req.user.id;

        // Validate all locations
        if (!Array.isArray(locations) || locations.length === 0) {
            return res.status(400).json({ message: "At least one location is required." });
        }

        // Format each location
        const validLocations = locations.map(location => ({
            address: location.address,
            latitude: location.coordinates[1],
            longitude: location.coordinates[0]
        }));

        // Check if profile exists
        let profile = await Freelancer.findOne({ userId });

        if (profile) {
            // Profile exists, push new locations
            profile.name = name;
            profile.bio = bio;
            profile.skills = skills;

            // Push each location to existing locations
            profile.locations.push(...validLocations);
            await profile.save();
        } else {
            // Create new profile
            profile = await Freelancer.create({
                userId,
                name,
                bio,
                skills,
                locations: validLocations
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving profile', error: err.message });
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
