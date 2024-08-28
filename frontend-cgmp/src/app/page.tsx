"use client"; // Mark this component as a Client Component
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./layout";
import MainScreen from "./components/mainScreen/MainScreen";

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<MainScreen />
		</ThemeProvider>
	);
}
