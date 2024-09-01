// Navigation.tsx
"use client";
import { useEffect, useState, MouseEvent } from "react";
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
	useMediaQuery,
	Link,
} from "@mui/material";
import { useTheme, ThemeProvider } from "@mui/material/styles";
import {
	appBarStyles,
	toolbarStyles,
	logoStyles,
	mobileLogoStyles,
	navBoxStyles,
	menuBoxStyles,
	avatarBoxStyles,
	userMenuStyles,
	navBoxItemStyles,
} from "./NavigationStyles";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "@/app/theme";
import { useUser } from "@/app/contexts/UserContext";
import axios from "axios";
import { useRouter } from "next/navigation";

const pages = [
	{ title: "Plots", url: "/plots" },
	{ title: "Tools", url: "/tools" },
	{ title: "Forum", url: "/forum" },
];
const settings = [
	{ title: "Login", url: "/login" },
	{ title: "Register", url: "/register" },
];

export default function Navigation() {
	const router = useRouter();
	const isLargeScreen = useMediaQuery("(min-width:1440px)");
	const { user, isAuthenticated, checkAuthStatus } = useUser();

	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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

	const handleNavigationToPage = (pageUrl: string) => {
		checkAuthStatus();
		router.push(pageUrl);
		handleCloseNavMenu();
	};

	const handleLogout = async () => {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`,
				{},
				{ withCredentials: true }
			);
			checkAuthStatus();
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<AppBar
				sx={{
					...appBarStyles,
					backgroundColor: theme.palette.primary.main,
				}}
			>
				<Container maxWidth="xl">
					<Toolbar sx={toolbarStyles} disableGutters>
						<Typography
							variant="h6"
							noWrap
							component="a"
							onClick={() => {
								router.push("/");
							}}
							sx={{
								...logoStyles,
								color: theme.palette.primary.contrastText,
							}}
						>
							{isLargeScreen
								? "Community Garden Management Platform"
								: "CGMP"}
						</Typography>

						{isAuthenticated ? (
							<Box sx={menuBoxStyles}>
								<IconButton
									size="large"
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={handleOpenNavMenu}
									color="inherit"
								>
									<MenuIcon />
								</IconButton>
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
											key={page.title}
											onClick={() => {
												handleNavigationToPage(
													page.url
												);
											}}
										>
											<Typography textAlign="center">
												{page.title}
											</Typography>
										</MenuItem>
									))}
								</Menu>
							</Box>
						) : (
							<></>
						)}

						<Typography
							variant="h5"
							noWrap
							component="a"
							onClick={() => {
								router.push("/");
							}}
							sx={{
								...mobileLogoStyles,
								color: theme.palette.primary.contrastText,
							}}
						>
							{isLargeScreen
								? "Community Garden Management Platform"
								: "CGMP"}
						</Typography>
						{isAuthenticated ? (
							<Box sx={navBoxStyles}>
								{pages.map((page) => (
									<Button
										key={page.title}
										onClick={() => {
											handleNavigationToPage(page.url);
										}}
										sx={navBoxItemStyles}
									>
										{page.title}
									</Button>
								))}
							</Box>
						) : (
							""
						)}
						<Box sx={avatarBoxStyles}>
							<Tooltip title="Open User Settings">
								<IconButton
									onClick={handleOpenUserMenu}
									sx={{ p: 0 }}
								>
									<Avatar
										alt="User Avatar"
										src="https://picsum.photos/id/69/200/300"
									/>
								</IconButton>
							</Tooltip>
							<Menu
								sx={userMenuStyles}
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
											onClick={() => {
												router.push(setting.url);
												handleCloseUserMenu();
											}}
										>
											<Typography textAlign="center">
												<Link
													style={{
														textDecoration: "none",
														color: theme.palette
															.primary.main,
													}}
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
