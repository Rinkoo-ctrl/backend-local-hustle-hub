const Freelancer = require('../models/Freelancer');
const Service = require('../models/Service');
const { getDistanceFromLatLonInKm } = require('../utils/distanceCalculator.js');


exports.createService = async (req, res) => {
    const { freelancerId, title, description, price, category } = req.body;
    try {
        const service = new Service({ freelancerId, title, description, price, category });
        await service.save();
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error creating service', error: err });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const freelancerId = req.params.freelancerId;

        const services = await Service.find({ freelancerId: freelancerId })
            .populate('freelancerId', 'name locations');

        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching services', error: err });
    }
};

exports.updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error updating service', error: err });
    }
};

exports.deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service', error: err });
    }
};


exports.getServicesByLocation = async (req, res) => {
    const { lat, lng, category } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }
    console.log(req.query)

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    try {
        // Fetch all freelancers
        const freelancers = await Freelancer.find();

        // Filter freelancers that have at least one location within a 10 km radius
        const nearbyFreelancers = freelancers.filter(freelancer => {
            return freelancer.locations.some(loc => {
                // Calculate distance using the haversine formula
                const distance = getDistanceFromLatLonInKm(userLat, userLng, loc.latitude, loc.longitude);
                console.log(distance,freelancer.name)
                return distance <= process.env.VICINITY_DISTANCE; // within 10 km
            });
        });

        // Get the IDs of the nearby freelancers
        const freelancerIds = nearbyFreelancers.map(f => f._id);

        // Build the service query with an optional category filter
        let serviceQuery = { freelancerId: { $in: freelancerIds } };
        if (category) {
            serviceQuery.category = category;
        }

        // Get services matching those freelancer IDs
        const services = await Service.find(serviceQuery)
            .populate('freelancerId', 'name locations');

        res.json(services);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching services by location', error: err });
    }
};


