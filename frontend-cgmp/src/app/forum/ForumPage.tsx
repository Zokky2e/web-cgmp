import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import { useUser } from "@/app/contexts/UserContext";
import { useState } from "react";
import ThreadDetails from "../components/thread/ThreadDetails";
import ThreadList from "../components/thread/ThreadList";

export default function ForumPage() {
	return (
		<ThemeProvider theme={theme}>
			<ThreadList />
		</ThemeProvider>
	);
}
