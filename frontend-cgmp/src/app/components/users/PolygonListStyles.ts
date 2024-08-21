import { SxProps, Theme } from "@mui/material/styles";
import { styled, TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)<{ selected: boolean }>(
	({ theme, selected }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover, // Gray if nth-of-type and not selected
		},
		backgroundColor: selected
			? ("theme.palette.primary.light !important" as any)
			: "", // Greenish background if selected
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
