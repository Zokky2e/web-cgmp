import { SxProps, Theme } from "@mui/material/styles";

export const appBarStyles: SxProps<Theme> = {
	position: "static",
};

export const toolbarStyles: SxProps<Theme> = {};

export const logoStyles: SxProps<Theme> = {
	mr: 2,
	display: { xs: "none", md: "flex" },
	fontFamily: "monospace",
	fontWeight: 700,
	letterSpacing: ".3rem",
	color: "inherit",
	textDecoration: "none",
};

export const mobileLogoStyles: SxProps<Theme> = {
	mr: 2,
	display: { xs: "flex", md: "none" },
	flexGrow: 1,
	fontFamily: "monospace",
	fontWeight: 700,
	letterSpacing: ".3rem",
	color: "inherit",
	textDecoration: "none",
};

export const navBoxStyles: SxProps<Theme> = {
	flexGrow: 1,
	display: { xs: "none", md: "flex" },
};

export const menuBoxStyles: SxProps<Theme> = {
	flexGrow: 1,
	display: { xs: "flex", md: "none" },
};

export const avatarBoxStyles: SxProps<Theme> = {
	flexGrow: 0,
};

export const userMenuStyles: SxProps<Theme> = {
	mt: "45px",
};
