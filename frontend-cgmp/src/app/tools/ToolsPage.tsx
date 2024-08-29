"use client"; // Mark this component as a Client Component
import { ThemeProvider } from "@emotion/react";
import { theme } from "../layout";
import { useUser } from "../contexts/UserContext";
import PolygonList from "../components/polygons/PolygonList";
import UserList from "../components/admin/UserList";
import AdminTools from "../components/admin/AdminTools";
import { Box, CircularProgress } from "@mui/material";
import { CircleLoaderStyles } from "../components/polygons/PolygonListStyles";

export default function ToolsPage() {
	const { user, isAuthenticated } = useUser();

	const renderSwitch = () => {
		if (user != null) {
			switch (user.job) {
				case "manager":
					return (
						<>
							<PolygonList title="Manage plots" />
						</>
					);
					break;
				case "admin":
					return (
						<>
							<AdminTools />
						</>
					);
					break;
				default:
					return <>User</>;
					break;
			}
		}
		return (
			<Box sx={CircleLoaderStyles}>
				<CircularProgress />
			</Box>
		);
	};

	return <ThemeProvider theme={theme}>{renderSwitch()}</ThemeProvider>;
}
