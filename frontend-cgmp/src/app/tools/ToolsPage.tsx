"use client"; // Mark this component as a Client Component
import { ThemeProvider } from "@emotion/react";
import { theme } from "../layout";
import { useUser } from "../contexts/UserContext";
import PolygonList from "../components/polygons/PolygonList";
import UserList from "../components/admin/UserList";
import AdminTools from "../components/admin/AdminTools";

export default function ToolsPage() {
	const { user, isAuthenticated } = useUser();

	const renderSwitch = () => {
		if (user != null) {
			switch (user.job) {
				case "manager":
					return (
						<>
							<PolygonList />
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
		return "<></>";
	};

	return <ThemeProvider theme={theme}>{renderSwitch()}</ThemeProvider>;
}
