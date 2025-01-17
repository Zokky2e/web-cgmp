import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import UserList from "./UserList";
import PolygonList from "../polygons/PolygonList";
import { Box, Typography } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";
import {
	containerStyles,
	treeItemStyles,
	treeViewStyles,
} from "./AdminToolsStyles";
import { useState } from "react";
import { IPolygon } from "@/app/models";

export default function AdminTools() {
	const [selectedPolygon, setSelectedPolygon] = useState<IPolygon | null>(
		null
	);
	return (
		<ThemeProvider theme={theme}>
			<Typography
				variant="h4"
				noWrap
				sx={{ display: "flex", justifyContent: "center", mt: "16px" }}
			>
				Admin Tools
			</Typography>
			<Box sx={containerStyles}>
				{/* Apply max width to the entire TreeView */}
				<SimpleTreeView sx={treeViewStyles}>
					<TreeItem
						sx={treeItemStyles}
						itemId="polygons"
						label="Polygons"
					>
						<PolygonList
							title="Edit plots"
							setSelectedPolygon={(polygon) => {
								setSelectedPolygon(polygon);
							}}
						/>
					</TreeItem>
					<TreeItem sx={treeItemStyles} itemId="users" label="Users">
						<UserList />
					</TreeItem>
				</SimpleTreeView>
			</Box>
		</ThemeProvider>
	);
}
