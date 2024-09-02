"use client";
// ThreadDetails.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
	Button,
	Container,
	List,
	ListItem,
	ListItemText,
	Paper,
	ThemeProvider,
	Typography,
} from "@mui/material";
import { IUser } from "@/app/models";
import { Thread } from "@/app/components/thread/Thread";
import CreateThread from "@/app/components/thread/CreateThread";
import theme from "@/app/theme";

interface Message {
	_id: string;
	message: string;
	timestamp: string;
	creatorId: IUser;
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
		<ThemeProvider theme={theme}>
			<Container sx={{ mt: "16px" }}>
				{thread && (
					<Paper>
						<Typography variant="h4">{thread.title}</Typography>
						<p>{thread.message}</p>
						<p>
							Created by:{" "}
							<strong>
								{thread.creatorId.firstName}{" "}
								{thread.creatorId.lastName}{" "}
							</strong>{" "}
							at {new Date(thread.timestamp).toLocaleString()}
						</p>
					</Paper>
				)}
				<List>
					{messages.map((msg) => (
						<ListItem key={msg._id}>
							<ListItemText
								primary={msg.message}
								secondary={`By ${msg.creatorId.firstName} ${
									msg.creatorId.lastName
								}  at ${new Date(
									msg.timestamp
								).toLocaleString()}`}
							/>
						</ListItem>
					))}
				</List>
				{openCreateMessage && (
					<CreateThread
						threadId={threadId as string}
						onClose={() => {
							setOpenCreateMessage(false);
							fetchThreadDetails();
						}}
					/>
				)}

				<Button
					variant="contained"
					color="primary"
					onClick={() => setOpenCreateMessage(true)}
				>
					Add Message
				</Button>
			</Container>
		</ThemeProvider>
	);
}
