"use client"; // Mark this component as a Client Component
import { ThemeProvider } from "@emotion/react";
import PolygonList from "../components/users/PolygonList";
import { theme } from "../layout";

export default function PlotsPage() {
	return (
		<ThemeProvider theme={theme}>
			<PolygonList />
		</ThemeProvider>
	);
}
