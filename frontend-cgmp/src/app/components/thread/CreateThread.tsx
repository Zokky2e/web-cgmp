// CreateThread.tsx
import React, { useState } from "react";
import axios from "axios";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";

interface CreateThreadProps {
	threadId?: string; // Optional thread ID for adding a message
	onClose: () => void;
}

export default function CreateThread({ threadId, onClose }: CreateThreadProps) {
	const [title, setTitle] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	const handleSubmit = async () => {
		try {
			const payload = threadId
				? { message, mainThreadId: threadId } // Adding a message to an existing thread
				: { title, message }; // Creating a new thread

			await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threads`,
				payload,
				{
					withCredentials: true,
				}
			);

			onClose();
		} catch (error) {
			console.error("Failed to create thread or message:", error);
		}
	};

	return (
		<Dialog open onClose={onClose}>
			<DialogTitle>
				{threadId ? "Add Message" : "Create New Thread"}
			</DialogTitle>
			<DialogContent>
				{!threadId && (
					<TextField
						autoFocus
						margin="dense"
						label="Title"
						type="text"
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				)}
				<TextField
					margin="dense"
					label="Message"
					type="text"
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleSubmit}
					color="primary"
					variant="contained"
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
}
