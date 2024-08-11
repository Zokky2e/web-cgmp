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
import { orange } from "@mui/material/colors";
import { theme } from "../layout";
import { useState } from "react";
import axios from "axios";
import { Alert } from "@mui/material";

export default function SignIn() {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const credentials = {
			email: data.get("email"),
			password: data.get("password"),
		};

		try {
			const response = await axios.post(
				"http://localhost:3000/api/login",
				credentials,
				{
					withCredentials: true, // Important for handling sessions
				}
			);

			setSuccess("Login successful!");
			setError("");
			console.log(response.data);

			// Redirect or perform further actions on successful login
			window.location.href = "/"; // Redirect to home page or dashboard
		} catch (er: any) {
			if (er.response) {
				// The request was made, and the server responded with a status code that falls out of the range of 2xx
				setError(
					er.response.data.message ||
						"Login failed. Please try again."
				);
			} else if (er.request) {
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
						Sign in
					</Typography>
					{error && <Alert severity="error">{error}</Alert>}
					{success && <Alert severity="success">{success}</Alert>}
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={
								<Checkbox value="remember" color="primary" />
							}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link href="#" variant="body2">
									Forgot password?
								</Link>
							</Grid>
							<Grid item>
								<Link href="/register" variant="body2">
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
