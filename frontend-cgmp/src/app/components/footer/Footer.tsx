import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { theme } from "@/app/layout";

function Copyright() {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "space-between",
			}}
		>
			<div>{"Copyright © Zoltan Balko Macsai "}</div>

			<div>
				{new Date().getFullYear()}
				{"."}
			</div>
		</Typography>
	);
}

export default function Footer() {
	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Box
					component="footer"
					sx={{
						py: 3,
						px: 2,
						mt: "auto",
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[200]
								: theme.palette.grey[800],
					}}
				>
					<Container maxWidth="sm">
						<Copyright />
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
