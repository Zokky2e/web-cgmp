import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/app/layout";
import {
	footerContainerStyles,
	footerStyles,
	typographyStyles,
} from "./FooterStyles";

function Copyright() {
	return (
		<>
			<p>{"Copyright © Zoltan Balko Macsai "}</p>
			<p>
				{new Date().getFullYear()}
				{"."}
			</p>
		</>
	);
}

export default function Footer() {
	return (
		<ThemeProvider theme={theme}>
			<Box sx={footerContainerStyles}>
				<Box component="footer" sx={footerStyles}>
					<Typography
						variant="subtitle1"
						color="text.secondary"
						sx={typographyStyles}
					>
						<Copyright />
					</Typography>
				</Box>
			</Box>
		</ThemeProvider>
	);
}
