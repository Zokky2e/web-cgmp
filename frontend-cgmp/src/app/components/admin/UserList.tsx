import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/app/layout";

export default function UserList() {
	return (
		<ThemeProvider theme={theme}>
			<div>users</div>
		</ThemeProvider>
	);
}
