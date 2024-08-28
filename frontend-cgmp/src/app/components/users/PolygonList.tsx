import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
	Button,
	CircularProgress,
	Container,
	Paper,
	styled,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Box,
	TablePagination,
	TablePaginationProps,
	Tooltip,
} from "@mui/material";
import NewPolygon from "./NewPolygon";
import { IPolygon, IRequestedPolygon } from "@/app/models";
import {
	StyledTableRow,
	containerStyles,
	boxStyles,
	gridContainerStyles,
	tableBoxStyles,
} from "./PolygonListStyles"; // Import styles
import { theme } from "@/app/layout";

export default function PolygonList() {
	const [data, setData] = useState<IPolygon[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [center, setCenter] = useState<number[]>([0, 0]);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(0);
	const [requestedPolygons, setRequestedPolygons] = useState<
		IRequestedPolygon[]
	>([]);
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
	useEffect(() => {
		fetchPolygons();
		fetchRequestedPolygons();
	}, [page, rowsPerPage]);

	useEffect(() => {
		const checkIfPolygonRequested = () => {
			const selectedPolygon =
				data[selectedRowIndex ? selectedRowIndex : 0];
			if (!selectedPolygon) return false;
			return requestedPolygons.some(
				(polygon) => polygon.polygonId === selectedPolygon.id
			);
		};

		setIsButtonDisabled(checkIfPolygonRequested());
	}, [selectedRowIndex, requestedPolygons, data]);

	const fetchPolygons = async () => {
		setLoading(true);
		try {
			const response: AxiosResponse<{
				data: IPolygon[];
				totalPages: number;
			}> = await axios.get(
				`http://localhost:3000/api/polygon?page=${
					page + 1
				}&limit=${rowsPerPage}`
			);

			const processedData = response.data.data.map((polygon) => {
				if (
					polygon.created_at &&
					Number(polygon.created_at) < 1000000000000
				) {
					return {
						...polygon,
						created_at: Number(polygon.created_at) * 1000,
					};
				}
				return polygon;
			});

			setData(processedData);
			setTotalPages(response.data.totalPages);
			setCenter(processedData[0]?.center || [0, 0]);
			setSelectedRowIndex(0);
			setLoading(false);
		} catch (error) {
			const axiosError = error as AxiosError;
			setError(axiosError.message);
			setLoading(false);
		}
	};

	const fetchRequestedPolygons = async () => {
		try {
			const response: AxiosResponse<IPolygon[]> = await axios.get(
				"http://localhost:3000/api/polygon/requested",
				{ withCredentials: true }
			);
			setRequestedPolygons(response.data); // Update the requested polygons state
		} catch (error) {
			console.error("Failed to fetch requested polygons:", error);
		}
	};

	const handleRequestPlot = async () => {
		const selectedPolygon = data[selectedRowIndex ? selectedRowIndex : 0];
		if (!selectedPolygon) return;

		try {
			await axios.post(
				`http://localhost:3000/api/polygon/request/${selectedPolygon.id}`,
				{},
				{ withCredentials: true }
			);
			// Refresh requested polygons list after making a request
			fetchRequestedPolygons();
		} catch (error) {
			console.error("Failed to request plot:", error);
		}
	};

	const handleChangePage: TablePaginationProps["onPageChange"] = (
		event,
		newPage
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage: React.ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRowClick = (index: number, center: number[]) => {
		setSelectedRowIndex(index);
		setCenter(center);
	};

	return (
		<Container sx={gridContainerStyles}>
			{loading && <CircularProgress />}
			{error && <Typography color="error">{error}</Typography>}
			<NewPolygon
				center={center}
				oldPolygons={data}
				onAddSuccess={() => {
					fetchPolygons();
				}}
				onCenterChanged={(center?: number[]) => {
					if (center && center.length == 2) {
						setCenter(center);
					}
				}}
			/>
			<Box sx={tableBoxStyles}>
				<Typography variant="h4" noWrap component="a">
					Available plots
				</Typography>
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
									theme={theme}
									key={
										row.id
											? (row.id as React.Key)
											: (index as React.Key)
									}
									selected={index === selectedRowIndex}
									onClick={() =>
										handleRowClick(
											index,
											row.center ? row.center : [0, 0]
										)
									}
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
													Number(row.created_at)
											  ).toUTCString()
											: new Date().toUTCString()}
									</TableCell>
								</StyledTableRow>
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
				<Box
					sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
				>
					<Tooltip
						title={isButtonDisabled ? "Already Requested" : ""}
						disableHoverListener={!isButtonDisabled}
					>
						<span>
							{" "}
							{/* Wrapper to ensure tooltip works on disabled button */}
							<Button
								variant="contained"
								color="primary"
								onClick={handleRequestPlot}
								disabled={isButtonDisabled}
								style={{
									pointerEvents: isButtonDisabled
										? "none"
										: "auto",
								}} // Prevents interaction with disabled button
							>
								Request Plot
							</Button>
						</span>
					</Tooltip>
				</Box>
			</Box>
		</Container>
	);
}
