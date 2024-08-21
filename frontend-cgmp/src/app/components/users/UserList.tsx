"use client"; // Mark this component as a Client Component

import { Key, MutableRefObject, useEffect, useRef, useState } from "react";
import axios from "axios";
import { IPolygon } from "@/app/models";
import {
	Button,
	Box,
	CircularProgress,
	Container,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import _ from "underscore";
import ReactMapboxGl, { Layer, GeoJSONLayer } from "react-mapbox-gl";
import { green } from "@mui/material/colors";
import { FillLayerSpecification } from "mapbox-gl";
import CreatePolygon from "./NewPolygon";
const accessToken =
	"pk.eyJ1Ijoiem9ra3kyZSIsImEiOiJjbTAxMThhMTYxbHBmMnJzYjR1eGxmZHBoIn0.wzqyHNfMopK1YzvpNIWUIg";
const Map = ReactMapboxGl({
	accessToken,
});
const mapStyle = {
	width: "600px",
	height: "600px",
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

const style = "mapbox://styles/mapbox/satellite-v9";
export default function UserList() {
	const [data, setData] = useState<IPolygon[]>([]);
	const [imageUrl, setImageUrl] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [center, setCenter] = useState<number[]>([0, 0]);
	function openImage(id: String, created_at: Number) {
		return `http://localhost:3000/api/polygon/${id}/${created_at}`;
	}
	useEffect(() => {
		fetchPolygons();
	}, []);

	function fetchPolygons() {
		axios
			.get(`http://localhost:3000/api/polygon`)
			.then((response) => {
				const data: IPolygon[] = response.data;
				console.log(data[0]);
				setCenter(data[0].center ? data[0].center : [0, 0]);
				setData(data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}

	return (
		<Container maxWidth="md">
			{loading && <CircularProgress />}
			{error && <Typography color="error">{error}</Typography>}
			<CreatePolygon
				center={center}
				oldPolygons={data}
				onAddSuccess={() => {
					fetchPolygons();
				}}
			/>
			<Box my={4}>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Field Name</TableCell>
								<TableCell align="right">Area</TableCell>
								<TableCell align="right">Center</TableCell>
								<TableCell align="right">Created At</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row, index) => (
								<StyledTableRow
									key={
										row.id
											? (row.id as Key)
											: (index as Key)
									}
									onClick={() => {
										setCenter(
											row.center ? row.center : [0, 0]
										);
									}}
								>
									<TableCell component="th" scope="row">
										{row.name}
									</TableCell>
									<TableCell align="right">
										{row.area ? row.area.toFixed(4) : "0"}
									</TableCell>
									<TableCell align="right">
										{row.center
											? `${row.center[0].toFixed(
													4
											  )}, ${row.center[1].toFixed(4)}`
											: "[0, 0]"}
									</TableCell>
									<TableCell align="right">
										{row.created_at
											? new Date(
													row.created_at
											  ).toUTCString()
											: new Date().toUTCString()}
									</TableCell>
								</StyledTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Container>
	);
}
