import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import UserList from "./UserList";
import PolygonList from "../polygons/PolygonList";
import { Box } from "@mui/material";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";
import {
	containerStyles,
	treeItemStyles,
	treeViewStyles,
} from "./AdminToolsStyles";

export default function AdminTools() {
	return (
		<ThemeProvider theme={theme}>
			<Box sx={containerStyles}>
				{/* Apply max width to the entire TreeView */}
				<SimpleTreeView sx={treeViewStyles}>
					<TreeItem
						sx={treeItemStyles}
						itemId="polygons"
						label="Polygons"
					>
						<PolygonList title="Edit plots" />
					</TreeItem>
					<TreeItem sx={treeItemStyles} itemId="users" label="Users">
						<UserList />
					</TreeItem>
				</SimpleTreeView>
			</Box>
		</ThemeProvider>
	);
}
