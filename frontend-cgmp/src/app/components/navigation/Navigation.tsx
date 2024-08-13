/* eslint-disable react-hooks/exhaustive-deps */
"use client"; // Mark this component as a Client Component

import { MouseEvent, useEffect, useState } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	Link,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { theme } from "@/app/layout";
import axios from "axios";

interface IMenuItem {
	title: string;
	url: string;
}

const pages = ["Products", "Pricing", "Blog"];
const settings: IMenuItem[] = [
	{ title: "Login", url: "/login" },
	{ title: "Register", url: "/register" },
];
export default function Navigation() {
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Check if the user is authenticated on component mount
		async function checkAuthStatus() {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/user/status",
					{
						withCredentials: true,
					}
				);
				setIsAuthenticated(response.data.isAuthenticated);
				setUser(response.data.user);
				if (!response.data.isAuthenticated) {
					if (
						location.pathname !== "/login" &&
						location.pathname !== "/register"
					) {
						window.location.href = "/login";
					}
				}
			} catch (error) {
				debugger;
				console.error("Error checking auth status:", error);
				window.location.href = "/login";
			}
		}

		checkAuthStatus();
	}, [location.pathname]);

	const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget);
	};
	const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseNavMenu = () => {
		setAnchorElNav(null);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleLogout = async () => {
		try {
			await axios.post(
				"http://localhost:3000/api/logout",
				{},
				{
					withCredentials: true,
				}
			);
			setIsAuthenticated(false);
			setUser(null);
			window.location.href = "/login";
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<AppBar position="static">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							LOGO
						</Typography>

						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "flex", md: "none" },
							}}
						>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								color="inherit"
							></IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorElNav}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "left",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "left",
								}}
								open={Boolean(anchorElNav)}
								onClose={handleCloseNavMenu}
								sx={{
									display: { xs: "block", md: "none" },
								}}
							>
								{pages.map((page) => (
									<MenuItem
										key={page}
										onClick={handleCloseNavMenu}
									>
										<Typography textAlign="center">
											{page}
										</Typography>
									</MenuItem>
								))}
							</Menu>
						</Box>
						<Typography
							variant="h5"
							noWrap
							component="a"
							href="/"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".3rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							LOGO
						</Typography>
						<Box
							sx={{
								flexGrow: 1,
								display: { xs: "none", md: "flex" },
							}}
						>
							{pages.map((page) => (
								<Button
									key={page}
									onClick={handleCloseNavMenu}
									sx={{
										my: 2,
										color: "white",
										display: "block",
									}}
								>
									{page}
								</Button>
							))}
						</Box>

						<Box sx={{ flexGrow: 0 }}>
							<Tooltip title="Open settings">
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}
								>
									<Avatar
										alt="Remy Sharp"
										src="https://picsum.photos/id/69/200/300"
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								{isAuthenticated ? (
									<MenuItem onClick={handleLogout}>
										<Typography textAlign="center">
											Logout
										</Typography>
									</MenuItem>
								) : (
									settings.map((setting) => (
										<MenuItem
											key={setting.title}
											onClick={handleCloseUserMenu}
										>
											<Typography textAlign="center">
												<Link
													style={{
														textDecoration: "none",
													}}
													href={setting.url}
												>
													{setting.title}
												</Link>
											</Typography>
										</MenuItem>
									))
								)}
							</Menu>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
		</ThemeProvider>
	);
}
