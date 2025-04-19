const Customer = require('../models/Customer');

exports.createOrUpdateCustomer = async (req, res) => {
    const { name, phoneNumber, gender, address, image } = req.body;
    console.log(JSON.stringify(req.body));

    try {
        const userId = req.user.id;

        let profile = await Customer.findOne({ userId });

        if (profile) {
            // Update existing profile
            profile.name = name;
            profile.phoneNumber = phoneNumber;
            profile.gender = gender;
            profile.address = address;
            profile.image = image;

            await profile.save();
        } else {
            // Create new profile
            profile = await Customer.create({
                userId,
                name,
                phoneNumber,
                gender,
                address,
                image
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving customer profile', error: err.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const profile = await Customer.findById(req.params.id);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customer profile', error: err });
    }
};
