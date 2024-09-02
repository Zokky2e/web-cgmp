"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Box,
	TablePagination,
	Container,
} from "@mui/material";
import { IOwnedPolygon, IUser } from "@/app/models";
import { useUser } from "@/app/contexts/UserContext";

export default function OwnedPolygonList() {
	const [ownedPolygons, setOwnedPolygons] = useState<IOwnedPolygon[]>([]);
	const [page, setPage] = useState<number>(0); // State for current page
	const [rowsPerPage, setRowsPerPage] = useState<number>(10); // State for rows per page
	const [totalPolygons, setTotalPolygons] = useState<number>(0); // State for total count of polygons
	const { user } = useUser();

	useEffect(() => {
		fetchOwnedPolygons();
	}, [user, page, rowsPerPage]); // Refetch when page or rowsPerPage changes

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0); // Reset to the first page
	};

	const fetchOwnedPolygons = async () => {
		try {
			let url = `${
				process.env.NEXT_PUBLIC_BACKEND_URL
			}/api/ownedPolygons?page=${page + 1}&limit=${rowsPerPage}`;
			console.log(user);
			// If the user is not a manager or admin, fetch only their polygons
			if (user && user.job !== "manager" && user.job !== "admin") {
				url += `&userId=${user.id}`;
			}

			const response = await axios.get(url, {
				withCredentials: true,
			});
			setOwnedPolygons(response.data.data);
			setTotalPolygons(response.data.total); // Set the total number of polygons
		} catch (error) {
			console.error("Failed to fetch owned polygons:", error);
		}
	};

	return (
		<Container sx={{ mt: "16px" }}>
			<Typography variant="h4" gutterBottom>
				Owned Fields
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Field Name</TableCell>
							<TableCell>User</TableCell>
							<TableCell>Acquired Date</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{ownedPolygons.map((polygon) => (
							<TableRow key={polygon.polygonId}>
								<TableCell>{polygon.polygonName}</TableCell>
								<TableCell>
									{polygon.userId.firstName}{" "}
									{polygon.userId.lastName}
								</TableCell>
								<TableCell>
									{new Date(polygon.acquiredAt).toUTCString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={totalPolygons}
				page={page}
				onPageChange={handleChangePage}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				rowsPerPageOptions={[5, 10, 25]}
			/>
		</Container>
	);
}
