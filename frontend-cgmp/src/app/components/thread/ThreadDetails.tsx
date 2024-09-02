// ThreadDetails.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button, List, ListItem, ListItemText, Paper } from "@mui/material";
import CreateThread from "./CreateThread";
import { IUser } from "@/app/models";
import { Thread } from "./Thread";

interface Message {
	_id: string;
	message: string;
	timestamp: string;
	creator: { username: string };
}

export default function ThreadDetails() {
	const router = useRouter();
	const { threadId } = useParams();
	const [thread, setThread] = useState<Thread | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [openCreateMessage, setOpenCreateMessage] = useState<boolean>(false);

	useEffect(() => {
		if (threadId) {
			fetchThreadDetails();
		}
	}, [threadId]);

	const fetchThreadDetails = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threads/${threadId}`
			);
			setThread(response.data.thread);
			setMessages(response.data.messages);
		} catch (error) {
			console.error("Failed to fetch thread details:", error);
		}
	};

	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				onClick={() => setOpenCreateMessage(true)}
			>
				Add Message
			</Button>
			{thread && (
				<Paper>
					<h2>{thread.title}</h2>
					<p>{thread.message}</p>
					<p>
						Created by: {thread.creatorId.firstName}{" "}
						{thread.creatorId.lastName} at{" "}
						{new Date(thread.timestamp).toLocaleString()}
					</p>
				</Paper>
			)}
			<List>
				{messages.map((msg) => (
					<ListItem key={msg._id}>
						<ListItemText
							primary={msg.message}
							secondary={`By ${
								msg.creator.username
							} at ${new Date(msg.timestamp).toLocaleString()}`}
						/>
					</ListItem>
				))}
			</List>
			{openCreateMessage && (
				<CreateThread
					threadId={threadId as string}
					onClose={() => setOpenCreateMessage(false)}
				/>
			)}
		</div>
	);
}
