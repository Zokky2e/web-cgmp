const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Define a simple route
app.get("/", (req, res) => {
	res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
