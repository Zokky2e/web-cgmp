import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import PolygonList from "../polygons/PolygonList";
import { Box, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";

export default function ManagerTools() {
	return (
		<ThemeProvider theme={theme}>
			<Typography
				variant="h4"
				noWrap
				sx={{ display: "flex", justifyContent: "center", mt: "16px" }}
			>
				Admin Tools
			</Typography>
			<Box>
				<PolygonList title="Edit plots" />
			</Box>
			<Box></Box>
		</ThemeProvider>
	);
}
