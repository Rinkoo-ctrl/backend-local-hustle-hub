const Service = require('../models/Service');

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
