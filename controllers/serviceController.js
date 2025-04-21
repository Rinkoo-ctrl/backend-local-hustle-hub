const Freelancer = require('../models/Freelancer');
const Service = require('../models/Service');
const { getDistanceFromLatLonInKm } = require('../utils/distanceCalculator.js');


exports.createService = async (req, res) => {
    const { freelancerId, title, description, price, category } = req.body;
    console.log(req.body, "--->")
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

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    try {
        // Fetch all freelancers
        const freelancers = await Freelancer.find();

        // Find freelancers within VICINITY_DISTANCE (e.g., 10 km)
        const nearbyFreelancersWithDistance = freelancers.map(freelancer => {
            const distances = freelancer.locations.map(loc =>
                getDistanceFromLatLonInKm(userLat, userLng, loc.latitude, loc.longitude)
            );
            console.log(distances, "--->")
            const minDistance = Math.min(...distances);
            return {
                freelancer,
                distance: minDistance
            };
        }).filter(({ distance }) => distance <= parseFloat(process.env.VICINITY_DISTANCE || 10));
        console.log(nearbyFreelancersWithDistance, "--->")
        // Map freelancerId to distance
        const freelancerDistanceMap = {};
        nearbyFreelancersWithDistance.forEach(({ freelancer, distance }) => {
            freelancerDistanceMap[freelancer._id.toString()] = distance;
        });
        console.log(freelancerDistanceMap, "--->")

        // Get service query
        const freelancerIds = Object.keys(freelancerDistanceMap);
        let serviceQuery = { freelancerId: { $in: freelancerIds } };
        if (category) {
            serviceQuery.category = category;
        }

        // Fetch services
        const services = await Service.find(serviceQuery)
            .populate('freelancerId', 'name locations');

        // Attach distance to each service
        const servicesWithDistance = services.map(service => {
            const distance = freelancerDistanceMap[service.freelancerId._id.toString()];
            return {
                ...service.toObject(), // convert Mongoose doc to plain object
                distance: Number(distance.toFixed(2)) // round to 2 decimal
            };
        });


        res.json(servicesWithDistance);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching services by location', error: err });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id).populate('freelancerId', 'name bio skills image locations');
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        console.log(service);
        res.status(200).json(service);
    } catch (err) {
        console.error("Error fetching service by ID:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllServicesGlobal = async (req, res) => {
    try {
        const { category, lat, lng, page = 1, limit = 10, search } = req.query;
        console.log(req.query);

        if (!lat || !lng) {
            return res.status(400).json({ message: "Latitude and Longitude are required" });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        const filter = {};

        // ✅ Handle multiple categories
        if (category) {
            if (Array.isArray(category)) {
                filter.category = { $in: category };
            } else if (typeof category === 'string') {
                const categoryArray = category.split(',');
                filter.category = { $in: categoryArray };
            }
        }

        // ✅ Add search (on category & description)
        if (search) {
            const searchRegex = new RegExp(search, 'i'); // case-insensitive
            filter.$or = [
                { category: searchRegex },
                { description: searchRegex }
            ];
        }

        console.log(filter, "filterrrrr");

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const allServices = await Service.find(filter)
            .populate('freelancerId', 'name image locations')
            .lean();

        const totalCount = allServices.length;

        const servicesWithDistance = allServices.map(service => {
            const freelancerLocations = service.freelancerId?.locations || [];

            const distances = freelancerLocations.map(loc =>
                getDistanceFromLatLonInKm(userLat, userLng, loc.latitude, loc.longitude)
            );

            const minDistance = distances.length ? Math.min(...distances) : Infinity;

            return {
                ...service,
                distance: Number(minDistance.toFixed(2))
            };
        });

        // Sort by distance
        const sorted = servicesWithDistance.sort((a, b) => a.distance - b.distance);

        // Paginate after sorting
        const paginated = sorted.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            services: paginated,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page),
            totalCount
        });

    } catch (err) {
        console.error("Service Fetch Error:", err);
        res.status(500).json({ message: 'Error fetching services', error: err });
    }
};
