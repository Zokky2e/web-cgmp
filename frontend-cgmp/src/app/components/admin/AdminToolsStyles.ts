import { SxProps, Theme } from "@mui/material";

export const containerStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "flex-start", // Align items from the top
	width: "100%",
	padding: "16px",
	gap: 2,
	boxSizing: "border-box",
};

export const treeViewStyles: SxProps<Theme> = {
	width: "100%",
};

export const treeItemStyles: SxProps<Theme> = {
	width: "100%",
	backgroundColor: "white",
	boxShadow: 2,
	borderRadius: 2,
	marginBottom: "16px",
	paddingBottom: "16px",
};
