const User = require("../models/User");
const Freelancer = require('../models/Freelancer');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        return res.status(201).json({ message: "User registered successfully. Please login." });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials!!!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials!!" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        const freelancerProfile = await Freelancer.findOne({ userId: user._id });

        res.json({
            token, user: {
                id: user._id, name: user.name, email, isFreelancer: !!freelancerProfile,
                freelancerProfile: freelancerProfile || null
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
