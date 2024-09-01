// UserList.tsx
import React, { useState, useEffect } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
	ThemeProvider,
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TablePagination,
	Button,
	Tooltip,
	TextField,
	Modal,
} from "@mui/material";
import theme from "@/app/theme";
import {
	StyledUserTableRow,
	tableContainerStyles,
	tableBoxStyles,
	paginationBoxStyles,
} from "./UserListStyles";
import { IUser } from "@/app/models";
import { popupStyle } from "../shared/SharedStyles";

export default function UserList() {
	const [users, setUsers] = useState<IUser[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(0);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		fetchUsers();
	}, [page, rowsPerPage]);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response: AxiosResponse<{
				data: IUser[];
				totalPages: number;
			}> = await axios.get(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users?page=${
					page + 1
				}&limit=${rowsPerPage}&searchQuery=${searchQuery}`,
				{
					withCredentials: true,
				}
			);

			setUsers(response.data.data);
			setTotalPages(response.data.totalPages);
			setLoading(false);
		} catch (error) {
			const axiosError = error as AxiosError;
			setError(axiosError.message);
			setLoading(false);
		}
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};
	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRowClick = (index: number) => {
		setSelectedRowIndex(index);
	};

	const handleSearchChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setSearchQuery(event.target.value);
	};

	const handleSearch = () => {
		setPage(0);
		fetchUsers();
	};

	function openEditUserInfo(userId: String) {
		//fetch user by id
	}

	function confirmEditUser() {}

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<ThemeProvider theme={theme}>
			<Box sx={tableContainerStyles}>
				<Typography variant="h4" noWrap component="a">
					Users
				</Typography>
				<Box sx={{ display: "flex", gap: 2, my: 2 }}>
					<TextField
						label="Search by Name or Email"
						variant="outlined"
						size="small"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSearch}
					>
						Search
					</Button>
				</Box>
				<TableContainer component={Paper} sx={tableBoxStyles}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Email</TableCell>
								<TableCell>First Name</TableCell>
								<TableCell>Last Name</TableCell>
								<TableCell align="right">Age</TableCell>
								<TableCell align="right">Job</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user, index) => (
								<StyledUserTableRow
									theme={theme}
									key={user.id as React.Key}
									selected={index === selectedRowIndex}
									onClick={() => handleRowClick(index)}
								>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.firstName}</TableCell>
									<TableCell>{user.lastName}</TableCell>
									<TableCell align="right">
										{user.age.toFixed()}
									</TableCell>
									<TableCell align="right">
										{user.job}
									</TableCell>
									<TableCell>
										<Button
											variant="contained"
											color="primary"
											onClick={() => {
												openEditUserInfo(user.id);
											}}
										></Button>
									</TableCell>
								</StyledUserTableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					sx={paginationBoxStyles}
					component="div"
					count={totalPages * rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					rowsPerPage={rowsPerPage}
					rowsPerPageOptions={[6, 10, 25, 100]}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Box>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={popupStyle}>
					<Typography
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						User
					</Typography>
					<Box
						id="modal-modal-description"
						sx={{
							mt: 2,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<TextField
							required
							id="outlined-required"
							label="Required"
							value=""
							onChange={() => {}}
						/>
						<Button
							variant="contained"
							onClick={() => confirmEditUser()}
						>
							Add
						</Button>
					</Box>
				</Box>
			</Modal>
		</ThemeProvider>
	);
}
