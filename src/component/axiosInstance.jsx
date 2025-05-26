import axios from "axios";

export const backendBaseUrl = "https://admin.birdboxtools.com";

const axiosInstance = axios.create({
	baseURL: `${backendBaseUrl}/api/v1`,
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const token = localStorage.getItem("authToken");

		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

const refreshAccessToken = async () => {
	try {
		const refreshToken = localStorage.getItem("refreshToken");

		if (!refreshToken) {
			throw new Error("No refresh token found");
		}

		const response = await axiosInstance.post("/accounts/token/refresh/", {
			refresh: refreshToken, // Adjust based on your backend's expected field
		});

		const { access } = response.data; // Adjust based on your API response

		localStorage.setItem("authToken", access);
		if (response.data.refresh) {
			localStorage.setItem("refreshToken", response.data.refresh);
		}

		return access;
	} catch (error) {
		console.error("Error refreshing access token:", error);
		throw new Error("Failed to refresh access token");
	}
};

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const token = localStorage.getItem("authToken");
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			if (token) {
				const newToken = await refreshAccessToken();
				if (newToken) {
					originalRequest.headers[
						"Authorization"
					] = `Bearer ${newToken}`;
					return axiosInstance(originalRequest);
				}
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
