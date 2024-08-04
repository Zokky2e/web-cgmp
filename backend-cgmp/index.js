const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors()); // Enable CORS for all origins
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
	id: String,
	name: String,
	age: Number,
	job: String,
});

const User = model("user", userSchema);
mongoose
	.connect("mongodb://localhost:27017/cgmp-dev", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB...", err));

// Middleware
app.use(express.json()); // Parse JSON bodies

// Define a simple route
app.get("/", (req, res) => {
	User.find()
		.then((docs) => {
			res.send(docs);
		})
		.catch((err) => res.send(err));
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
