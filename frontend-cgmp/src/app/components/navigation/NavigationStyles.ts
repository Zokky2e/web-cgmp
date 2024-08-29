import { theme } from "@/app/layout";
import { SxProps, Theme } from "@mui/material/styles";

export const appBarStyles: SxProps<Theme> = {
	position: "static",
};

export const toolbarStyles: SxProps<Theme> = {
	display: { md: "flex" },
	justifyContent: "space-between",
};

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
	gap: "16px",
	marginRight: "16px",
	justifyContent: "flex-end",
};

export const navBoxItemStyles: SxProps<Theme> = (theme) => ({
	my: 2,
	color: theme.palette.primary.contrastText,
	display: "block",
	"&::after": {
		content: '""',
		position: "absolute",
		left: 0,
		bottom: 0,
		width: "0%",
		height: "1px",
		backgroundColor: theme.palette.primary.contrastText,
		transition: "width 0.3s ease-in-out",
	},

	"&:hover::after": {
		width: "100%",
	},
});

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
