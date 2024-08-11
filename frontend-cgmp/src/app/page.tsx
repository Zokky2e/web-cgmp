"use client"; // Mark this component as a Client Component

import { Button, Link, Typography } from "@mui/material";
import UserList from "./components/users/UserList";
import SignIn from "./login/SignIn";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./layout";

export default function Home() {
	return (
		<ThemeProvider theme={theme}>
			<UserList />
		</ThemeProvider>
	);
}
