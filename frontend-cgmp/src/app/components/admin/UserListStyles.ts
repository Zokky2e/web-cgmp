// UserListStyles.ts
import { SxProps, Theme } from "@mui/material/styles";
import { styled, TableRow } from "@mui/material";

export const StyledUserTableRow = styled(TableRow)<{ selected: boolean }>(
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

export const tableContainerStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	my: 4,
};

export const tableBoxStyles: SxProps<Theme> = {
	width: { xs: "100%", md: "50%" },
	overflowX: "auto",
};

export const paginationBoxStyles: SxProps<Theme> = {
	mt: 2,
	width: { xs: "100%", md: "50%" },
	display: "flex",
	alignSelf: "flex-end",
};

export const userPopupStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};
