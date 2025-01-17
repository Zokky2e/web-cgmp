import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import theme from "@/app/theme";
import { useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SignUp() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const user = {
			email: data.get("email"),
			password: data.get("password"),
			firstName: data.get("firstName"),
			lastName: data.get("lastName"),
		};

		if (user.email) {
		}

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
				user,
				{
					withCredentials: true, // Important if you're dealing with sessions
				}
			);

			setSuccess("User registered successfully!");
			setError("");
			// Redirect or perform further actions on successful login
			router.push("/login"); // Redirect to home page or dashboard
		} catch (er: any) {
			if (er.response) {
				// The request was made, and the server responded with a status code that falls out of the range of 2xx
				setError(er.response.data.message);
			} else if (er.request) {
				console.log(er.request);
				// The request was made, but no response was received
				setError("No response from server. Please try again later.");
			} else {
				// Something happened in setting up the request that triggered an Error
				setError("An unexpected error occurred.");
			}
			setSuccess("");
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
					</Typography>
					{error && <Alert severity="error">{error}</Alert>}
					{success && <Alert severity="success">{success}</Alert>}
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign Up
						</Button>
						<Grid container justifyContent="flex-end">
							<Grid item>
								<Link href="/login" variant="body2">
									Already have an account? Sign in
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
