"use client"; // Mark this component as a Client Component
import { ThemeProvider } from "@emotion/react";
import PolygonList from "../components/polygons/PolygonList";
import theme from "@/app/theme";

export default function PlotsPage() {
	return (
		<ThemeProvider theme={theme}>
			<PolygonList title="Available plots" />
		</ThemeProvider>
	);
}
