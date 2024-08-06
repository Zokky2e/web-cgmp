const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user-routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

mongoose
	.connect("mongodb://localhost:27017/cgmp-dev")
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB...", err));
// Middleware

// Use user routes
app.use("/api", userRoutes);

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
