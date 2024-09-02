"use client";
// ThreadList.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Container,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CreateThread from "./CreateThread";
import { Thread } from "./Thread";

export default function ThreadList() {
	const [threads, setThreads] = useState<Thread[]>([]);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [openCreateThread, setOpenCreateThread] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		fetchThreads();
	}, [page, rowsPerPage]);

	const fetchThreads = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/threads?page=${
					page + 1
				}&limit=${rowsPerPage}`
			);
			setThreads(response.data.threads);
			setTotalPages(response.data.totalPages);
		} catch (error) {
			console.error("Failed to fetch threads:", error);
		}
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const openThreadDetails = (threadId: string) => {
		router.push(`/forum/thread/${threadId}`);
	};

	return (
		<Container sx={{ mt: "16px" }}>
			<Button
				variant="contained"
				color="primary"
				onClick={() => setOpenCreateThread(true)}
			>
				Create New Thread
			</Button>
			<TableContainer component={Paper} sx={{ mt: "16px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Creator</TableCell>
							<TableCell>Timestamp</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{threads.map((thread) => (
							<TableRow
								key={thread._id}
								onClick={() => openThreadDetails(thread._id)}
							>
								<TableCell>{thread.title}</TableCell>
								<TableCell>
									{thread.creatorId.firstName}{" "}
									{thread.creatorId.lastName}
								</TableCell>
								<TableCell>
									{new Date(
										thread.timestamp
									).toLocaleString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={totalPages * rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			{openCreateThread && (
				<CreateThread
					onClose={() => {
						setOpenCreateThread(false);
						fetchThreads();
					}}
				/>
			)}
		</Container>
	);
}
