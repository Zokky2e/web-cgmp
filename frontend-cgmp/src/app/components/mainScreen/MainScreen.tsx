import React from "react";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import { heroSectionStyles, featureBoxStyles } from "./MainScreenStyles"; // Import styles
import { useRouter } from "next/navigation";

export default function MainScreen() {
	const router = useRouter();
	return (
		<Container maxWidth="lg">
			{/* Hero Section */}
			<Box
				sx={{
					...heroSectionStyles,
					height: { xs: "auto", md: "60vh" },
					padding: { xs: 2, md: 4 },
				}}
			>
				{/* Adjust title sizes for responsiveness */}
				<Typography
					variant="h4"
					component="h1"
					gutterBottom
					sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }} // Responsive font size
				>
					Community Garden Management Platform
				</Typography>
				<Typography
					variant="h5"
					component="h2"
					gutterBottom
					sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }} // Responsive font size
				>
					Welcome to our Community
				</Typography>
				<Typography variant="body1" color="textSecondary" paragraph>
					Discover the best plots, request them easily, and start
					planning your next project with confidence!
				</Typography>
				<Button
					variant="contained"
					color="primary"
					sx={{ mt: 2, px: 4 }}
					onClick={() => {
						router.push("/plots");
					}}
				>
					Get Started
				</Button>
			</Box>

			{/* Features Section */}
			<Grid container spacing={2} sx={{ py: { xs: 2, md: 4 } }}>
				<Grid xs={12} sm={6} md={4}>
					<Box sx={featureBoxStyles}>
						<Typography variant="h6" gutterBottom>
							Easy Plot Requests
						</Typography>
						<Typography variant="body2" color="textSecondary">
							Request your desired plots with just a click and
							manage them all in one place.
						</Typography>
					</Box>
				</Grid>
				<Grid xs={12} sm={6} md={4}>
					<Box sx={featureBoxStyles}>
						<Typography variant="h6" gutterBottom>
							Plot Details & Weather Reports
						</Typography>
						<Typography variant="body2" color="textSecondary">
							Get in-depth details about your plots, access
							real-time weather reports, and plan your activities
							with confidence.
						</Typography>
					</Box>
				</Grid>
				<Grid xs={12} sm={6} md={4}>
					<Box sx={featureBoxStyles}>
						<Typography variant="h6" gutterBottom>
							Connect with Other Farmers
						</Typography>
						<Typography variant="body2" color="textSecondary">
							Join our community forums to discuss with fellow
							farmers, share experiences, and get expert advice.
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
