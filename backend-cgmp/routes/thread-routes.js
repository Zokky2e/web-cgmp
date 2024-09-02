const express = require("express");
const router = express.Router();
const threadController = require("../controllers/thread-controller");
const isAuthenticated = require("../middleware/authentication");

// Create a new thread or message
router.post("/threads", isAuthenticated, threadController.createThread);

// Get paginated threads (only main threads)
router.get("/threads", threadController.getPagedThreads);

// Get a thread by ID and its messages
router.get("/threads/:id", threadController.getThreadById);

module.exports = router;
