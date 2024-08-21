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
} from "@mui/material";
import NewPolygon from "./NewPolygon";
import { IPolygon } from "@/app/models";
import {
	StyledTableRow,
	containerStyles,
	boxStyles,
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

	useEffect(() => {
		fetchPolygons();
	}, [page, rowsPerPage]);

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
		<Container sx={containerStyles}>
			{loading && <CircularProgress />}
			{error && <Typography color="error">{error}</Typography>}
			<NewPolygon
				center={center}
				oldPolygons={data}
				onAddSuccess={() => {
					fetchPolygons();
				}}
			/>
			<Box sx={boxStyles}>
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
			</Box>
		</Container>
	);
}
