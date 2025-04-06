const express = require('express');
const router = express.Router();
const Freelancer = require('../models/Freelancer');
const Service = require('../models/Service');

router.post('/freelancers', async (req, res) => {
    const { userId, name, bio, skills, location, images } = req.body;
    try {
        const profile = await Freelancer.findOneAndUpdate(
            { userId },
            { name, bio, skills, location, images },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error saving profile', error: err });
    }
});

router.get('/freelancers/:id', async (req, res) => {
    try {
        const profile = await Freelancer.findById(req.params.id);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching profile', error: err });
    }
});


module.exports = router;
