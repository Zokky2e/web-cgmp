// theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			light: "#63AE5B",
			main: "#52964A",
			dark: "#437B3D",
			contrastText: "#fff",
		},
		secondary: {
			light: "#695E4F",
			main: "#51493D",
			dark: "#3A342C",
			contrastText: "#000",
		},
	},
});

export default theme;
