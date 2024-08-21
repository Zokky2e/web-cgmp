import { SxProps, Theme } from "@mui/material/styles";

export const footerContainerStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "flex-end",
};

export const footerStyles: SxProps<Theme> = {
	py: 3,
	px: 2,
	backgroundColor: (theme) =>
		theme.palette.mode === "light"
			? theme.palette.grey[200]
			: theme.palette.grey[800],
};

export const typographyStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
};
