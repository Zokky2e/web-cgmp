const Thread = require("../models/thread");

// Create a new thread or message
exports.createThread = async (req, res) => {
	try {
		const { title, message, mainThreadId } = req.body;
		const creatorId = req.user._id; // Assume user ID is available in req.user from session

		const newThread = new Thread({
			title: title || "", // Title is optional for messages
			message,
			isThread: !mainThreadId, // If mainThreadId is provided, it's a message
			mainThreadId: mainThreadId || null,
			creatorId,
		});

		await newThread.save();
		res.status(201).json({
			message: "Thread or message created",
			thread: newThread,
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get paginated threads (only those marked as main threads)
exports.getPagedThreads = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		const threads = await Thread.find({ isThread: true })
			.sort({ timestamp: -1 }) // Newest threads first
			.skip(skip)
			.limit(limit)
			.populate("creatorId", "firstName lastName"); // Populate the creator's username

		const totalThreads = await Thread.countDocuments({ isThread: true });

		res.status(200).json({
			threads,
			totalPages: Math.ceil(totalThreads / limit),
		});
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

// Get a thread and its messages
exports.getThreadById = async (req, res) => {
	try {
		const threadId = req.params.id;

		// Find the main thread
		const thread = await Thread.findOne({
			_id: threadId,
			isThread: true,
		}).populate("creatorId", "firstName lastName");
		if (!thread) {
			return res.status(404).json({ message: "Thread not found" });
		}

		// Find all messages related to the thread
		const messages = await Thread.find({ mainThreadId: threadId })
			.sort({ timestamp: 1 }) // Chronological order
			.populate("creatorId", "firstName lastName");

		res.status(200).json({ thread, messages });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
