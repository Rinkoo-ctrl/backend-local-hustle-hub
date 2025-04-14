// controllers/bookingController.js
const Booking = require("../models/Booking");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createBooking = async (req, res) => {
    try {
        const { freelancerId, serviceId, date, amount } = req.body;
        console.log(req.body, req.user.id)
        const booking = await Booking.create({
            userId: req.user.id,
            freelancerId,
            serviceId,
            date,
            amount,
            status: "pending",
            paymentStat6us: "pending",
        });

        res.status(201).json(booking);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating booking", details: error });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: "Error updating booking status", details: error });
    }
};

exports.createPaymentIntent = async (req, res) => {
    const { amount, currency = "inr" } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,
            currency,
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            req.headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;

        await Booking.findOneAndUpdate(
            { paymentId: paymentIntent.id },
            { paymentStatus: "paid" }
        );
    }

    res.json({ received: true });
};
