// layout.tsx
"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import Navigation from "./components/navigation/Navigation";
import { createTheme } from "@mui/material/styles";
import Footer from "./components/footer/Footer";
import { UserProvider } from "./contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</head>
			<body className={inter.className}>
				<UserProvider>
					{" "}
					{/* Wrap your app with the UserProvider */}
					<div>
						<Navigation />
						{children}
					</div>
					<Footer />
				</UserProvider>
			</body>
		</html>
	);
}
