import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance, { backendBaseUrl } from "./axiosInstance";

// Create AuthContext
const AuthContext = createContext();

// Provide AuthContext to children
export const AuthProvider = ({ children }) => {
	// Initialize auth state with localStorage values
	const [auth, setAuth] = useState(() => {
		const token = localStorage.getItem("authToken");
		const email = localStorage.getItem("email");
		return { token: token || null, email: email || null };
	});

	// Login function
	const login = async (email, token, resfresh_token) => {
		try {
			setAuth({ token, email });
			localStorage.setItem("authToken", token);
			localStorage.setItem("resfresh_token", resfresh_token);
			localStorage.setItem("email", email);

			const response = await axiosInstance.get("/accounts/profile/");
			const data = response.data;
			localStorage.setItem("name", data?.name);
			if (data?.image) {
				localStorage.setItem(
					"image",
					`${backendBaseUrl}${data?.image}`
				);
			}

			console.log(data);
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	// Logout function
	const logout = () => {
		setAuth({ token: null, email: null });
		localStorage.removeItem("authToken");
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("email");
		localStorage.removeItem("name");
		localStorage.removeItem("image");
		localStorage.removeItem("role");
		localStorage.removeItem("resfresh_token");
	};

	// Check if user is authenticated
	const isAuthenticated = !!auth.token;

	return (
		<AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook for accessing AuthContext
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
