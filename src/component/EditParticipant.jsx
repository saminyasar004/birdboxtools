/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import axiosInstance from './axiosInstance';

const EditParticipantModal = ({
	isOpen,
	setIsOpen,
	participant,
	fetchParticipants,
}) => {
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
	});
	const [imageName, setImageName] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen && participant) {
			setFormData({
				first_name: participant.first_name || participant.firstName || '',
				last_name: participant.last_name || participant.lastName || '',
				email: participant.email || '',
			});
			setImageName(participant.image || '');
		}
	}, [isOpen, participant]);

	// Reset form when modal opens with participant data

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		setError('');
	};

	// Handle image upload
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageName(file.name);
			setError('');
		}
	};

	// Handle image delete
	const handleImageDelete = () => {
		setImageFile(null);
		setImageName('');
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.first_name || !formData.last_name || !formData.email) {
			setError('Please fill in all fields');
			return;
		}
		if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			setError('Please enter a valid email');
			return;
		}

		setLoading(true);
		setError('');

		const updateData = new FormData();
		updateData.append('first_name', formData.first_name);
		updateData.append('last_name', formData.last_name);
		updateData.append('email', formData.email);
		if (imageFile) {
			updateData.append('image', imageFile);
		}

		try {
			const response = await axiosInstance.put(
				`/dashboard/participant/${participant.id}/update/`,
				updateData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			if (response.status === 200) {
				alert('Participant updated successfully');
				setIsOpen(false);
				if (fetchParticipants) fetchParticipants(participant.seminar); // Refresh participant list
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to update participant. Please try again.'
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
					onClick={handleBackdropClick}>
					<div className="bg-[#0F0F0F] p-6 rounded-lg shadow-lg w-[26rem]">
						<div className="flex justify-between items-center mb-4">
							<button
								onClick={() => setIsOpen(false)}
								className="text-gray-400 hover:text-white"
								disabled={loading}>
								← Back
							</button>
							<h2 className="text-lg font-bold text-[#BDC5DB]">
								Edit Participant Details
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
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									First name
								</label>
								<input
									type="text"
									id="first_name"
									value={formData.first_name}
									onChange={handleChange}
									placeholder="Enter first name"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									Last name
								</label>
								<input
									type="text"
									id="last_name"
									value={formData.last_name}
									onChange={handleChange}
									placeholder="Enter last name"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									Email
								</label>
								<input
									type="email"
									id="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Enter email"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									Upload a pic
								</label>
								<div className="flex items-center">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										className="hidden"
										id="image-upload"
									/>
									<label
										htmlFor="image-upload"
										className="bg-gray-700 text-[#BDC5DB] px-3 py-1 rounded cursor-pointer hover:bg-gray-600">
										Upload a pic
									</label>
									{imageName && (
										<div className="ml-3 flex items-center">
											<span className="text-gray-400">{imageName}</span>
											<button
												type="button"
												onClick={handleImageDelete}
												className="ml-2 text-red-500 hover:text-red-700"
												disabled={loading}>
												<FaTrash />
											</button>
										</div>
									)}
								</div>
							</div>

							<button
								type="submit"
								disabled={loading}
								className={`bg-[#163B76] text-white px-4 py-2 rounded w-full ${
									loading
										? 'opacity-50 cursor-not-allowed'
										: 'hover:bg-blue-700'
								}`}>
								{loading ? 'Submitting...' : 'Submit'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditParticipantModal;
