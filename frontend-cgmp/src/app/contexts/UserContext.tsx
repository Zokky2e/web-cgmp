// UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { IUser } from "@/app/models"; // Adjust the import path as necessary

// Define the shape of the context
interface UserContextType {
	user: IUser | null;
	isAuthenticated: boolean;
	setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<IUser | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Fetch user status from the server
		async function checkAuthStatus() {
			try {
				const response = await axios.get(
					"http://localhost:3000/api/user/status",
					{ withCredentials: true }
				);
				setIsAuthenticated(response.data.isAuthenticated);
				setUser(response.data.user);

				// Handle redirection if the user is not authenticated
				if (
					typeof window !== "undefined" &&
					!response.data.isAuthenticated &&
					window.location.pathname !== "/login" &&
					window.location.pathname !== "/register" &&
					window.location.pathname !== "/"
				) {
					window.location.href = "/login";
				}
			} catch (error) {
				console.error("Error checking auth status:", error);
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
			}
		}

		if (typeof window !== "undefined") {
			checkAuthStatus();
		}
	}, []);

	return (
		<UserContext.Provider value={{ user, isAuthenticated, setUser }}>
			{children}
		</UserContext.Provider>
	);
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};
