import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import PolygonList from "../polygons/PolygonList";
import { Box, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";
import { useEffect, useState } from "react";
import { IPolygon, IUser } from "@/app/models";
import RequestedPolygonInfo from "../polygons/RequestedPolygonInfo";
import axios from "axios";

export default function ManagerTools() {
	const [selectedPolygon, setSelectedPolygon] = useState<IPolygon | null>(
		null
	);
	const [users, setUsers] = useState<IUser[]>([]);
	useEffect(() => {
		if (selectedPolygon && selectedPolygon.id) {
			const fetchRequestedPolygonUsers = async () => {
				try {
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/requestedPolygon/${selectedPolygon.id}`,
						{ withCredentials: true }
					);

					setUsers(
						response.data.map((request: any) => request?.userId)
					); // Extract the user information
				} catch (error) {
					console.error(
						"Error fetching requested polygon users:",
						error
					);
				}
			};

			fetchRequestedPolygonUsers();
		}
	}, [selectedPolygon]);
	return (
		<ThemeProvider theme={theme}>
			<Typography
				variant="h4"
				noWrap
				sx={{ display: "flex", justifyContent: "center", mt: "16px" }}
			>
				Manager Tools
			</Typography>
			<Box>
				<PolygonList
					title="Edit plots"
					setSelectedPolygon={(polygon) => {
						setSelectedPolygon(polygon);
					}}
				/>
			</Box>
			<RequestedPolygonInfo polygon={selectedPolygon} users={users} />
			<Box></Box>
		</ThemeProvider>
	);
}
