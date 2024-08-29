import { SxProps, Theme } from "@mui/material/styles";
import { styled, TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)<{ selected: boolean }>(
	({ theme, selected }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
		backgroundColor: selected
			? ("theme.palette.primary.light !important" as any)
			: "",
		"&:hover": {
			backgroundColor: theme.palette.primary.light,
			cursor: "pointer",
		},
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	})
);
export const containerStyles: SxProps<Theme> = {
	maxWidth: "md",
};

export const boxStyles: SxProps<Theme> = {
	my: 4,
};

export const gridContainerStyles: SxProps<Theme> = {
	paddingTop: "16px",
	display: "flex",
	flexDirection: { xs: "column", md: "row" },
	gap: 2,
	alignItems: "flex-start",
};

export const mapBoxStyles: SxProps<Theme> = {
	width: { xs: "100%", md: "50%" },
	marginBottom: { xs: 2, md: 0 },
};

export const tableBoxStyles: SxProps<Theme> = {
	width: { xs: "100%", md: "50%" },
	overflowX: "auto",
};
