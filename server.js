const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/freelancers', require('./routes/freelancerRoutes'));
app.use('/api/services', require('./routes/serviceRoutes.js'));

app.listen(5000, () => console.log("Server running on port 5000"));
