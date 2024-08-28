// mainScreenStyles.ts
import { SxProps, Theme } from "@mui/material/styles";

export const mainScreenStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "space-between",
};

export const heroSectionStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	textAlign: "center",
};

export const featureBoxStyles: SxProps<Theme> = {
	textAlign: "center",
	p: 2,
};
