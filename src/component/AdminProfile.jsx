import { useState, useEffect, useRef } from "react";
import { FaTrash } from "react-icons/fa";
import axiosInstance, { backendBaseUrl } from "./axiosInstance"; // Assuming this is your axios setup

// eslint-disable-next-line react/prop-types
const AdminProfile = ({ isOpen, setIsOpen }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		old_password: "",
		new_password: "",
	});
	const [image, setImage] = useState(null); // State for the uploaded image file
	const [imageName, setImageName] = useState(""); // State for displaying image name
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const fileInputRef = useRef(null); // Ref for file input

	const fetchProfile = async () => {
		setLoading(true);
		try {
			const response = await axiosInstance.get("/accounts/profile/");
			const data = response.data;
			setFormData({
				name: data.name || "",
				email: data.email || "",
				old_password: "",
				new_password: "",
			});
			if (data.image) {
				setImageName(`${backendBaseUrl}${data.image}`); // Extract filename from URL
				localStorage.setItem(
					"image",
					`${backendBaseUrl}${data?.image}`
				);
			}
		} catch (err) {
			setError("Failed to load profile data. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	// Fetch profile data when modal opens
	useEffect(() => {
		if (isOpen) {
			fetchProfile();
		}
	}, [isOpen]);

	// Handle input changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	// Handle image upload
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		const imageUrl = URL.createObjectURL(file);
		if (file) {
			setImage(file);
			setImageName(imageUrl);
			setError("");
		}
	};

	// Handle image delete
	const handleImageDelete = () => {
		setImage(null);
		setImageName("");
		if (fileInputRef.current) {
			fileInputRef.current.value = ""; // Clear file input
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.name || !formData.email) {
			setError("Name and email are required.");
			return;
		}
		if (formData.old_password && !formData.new_password) {
			setError("Please provide a new password.");
			return;
		}
		if (formData.new_password && !formData.old_password) {
			setError("Please provide the old password.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const data = new FormData();
			data.append("name", formData.name);
			data.append("email", formData.email);
			if (formData.old_password) {
				data.append("old_password", formData.old_password);
			}
			if (formData.new_password) {
				data.append("new_password", formData.new_password);
			}
			if (image) {
				data.append("image", image);
			}

			const response = await axiosInstance.put(
				"/accounts/update/",
				data,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (response.status === 200) {
				alert("Profile updated successfully");
				setIsOpen(false);
				setImage(null);
				setImageName("");
				setFormData((prev) => ({
					...prev,
					old_password: "",
					new_password: "",
				}));
				fetchProfile();
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					"Failed to update profile. Please try again."
			);
		} finally {
			setLoading(false);
		}
	};

	// Close modal if the backdrop is clicked
	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			setIsOpen(false);
		}
	};

	return (
		<div>
			{isOpen && (
				<div
					className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
					onClick={handleBackdropClick}
				>
					<div className="bg-[#0F0F0F] p-6 rounded-lg shadow-lg w-[30rem]">
						<div className="flex justify-between items-center mb-4">
							<button
								onClick={() => setIsOpen(false)}
								className="text-t_color hover:text-white"
								disabled={loading}
							>
								← Back
							</button>
							<h2 className="text-lg font-bold text-t_color">
								Edit Profile
							</h2>
							<span></span>
						</div>

						{error && (
							<div className="text-red-500 text-sm text-center mb-4">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									Name
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Enter name"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									Email
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Enter email"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4 text-gray-500">
								Change Password (Optional)
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									Old Password
								</label>
								<input
									type="password"
									name="old_password"
									value={formData.old_password}
									onChange={handleChange}
									placeholder="Enter old password"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									New Password
								</label>
								<input
									type="password"
									name="new_password"
									value={formData.new_password}
									onChange={handleChange}
									placeholder="Enter new password"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									Upload a Picture
								</label>
								<div className="flex items-center">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
										id="image-upload"
										ref={fileInputRef}
									/>
									<label
										htmlFor="image-upload"
										className="bg-gray-700 text-t_color px-3 py-1 rounded cursor-pointer hover:bg-gray-600"
									>
										Upload a picture
									</label>
									{imageName && (
										<div className="ml-3 flex items-center">
											<span className="w-16 h-16 text-t_color">
												<img
													src={imageName}
													alt="Profile Image"
												/>
											</span>
											<button
												type="button"
												onClick={handleImageDelete}
												className="ml-2 text-red-500 hover:text-red-700"
											>
												<FaTrash />
											</button>
										</div>
									)}
								</div>
							</div>

							<button
								type="submit"
								disabled={loading}
								className={`bg-blue-600 text-white px-4 py-2 rounded w-full ${
									loading
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-blue-700"
								}`}
							>
								{loading ? "Submitting..." : "Submit"}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminProfile;
