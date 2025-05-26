import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

// eslint-disable-next-line react/prop-types
const ScheduleSeminarModal = ({ isOpen, setIsOpen, fetchSeminarData }) => {
	const [formData, setFormData] = useState({
		location: '',
		date: '',
		coach: '',
	});
	const [coaches, setCoaches] = useState([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// Fetch coaches when modal opens
	useEffect(() => {
		if (isOpen) {
			const fetchCoaches = async () => {
				try {
					const response = await axiosInstance.get('/accounts/coach-list/');
					setCoaches(response.data); // Assuming response.data is an array of coach objects
				} catch (err) {
					setError('Failed to load coaches. Please try again.');
				}
			};
			fetchCoaches();
		}
	}, [isOpen]);

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		setError('');
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.location || !formData.date || !formData.coach) {
			setError('Please fill in all fields');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/dashboard/seminars/', {
				location: formData.location,
				date: formData.date,
				coach: formData.coach, // Sending coach ID
			});

			alert('Seminar scheduled successfully:', response.data);
			setIsOpen(false);
			fetchSeminarData();
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to schedule seminar. Please try again.'
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
					<div className="bg-[#0F0F0F] p-6 rounded-lg shadow-lg w-[30rem]">
						<div className="flex justify-between items-center mb-4">
							<button
								onClick={() => setIsOpen(false)}
								className="text-gray-400 hover:text-white"
								disabled={loading}>
								← Back
							</button>
							<h2 className="text-lg font-bold text-t_color">
								Schedule a Seminar
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
									Venue
								</label>
								<input
									type="text"
									id="location"
									value={formData.location}
									onChange={handleChange}
									placeholder="Enter venue"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									Date of seminar
								</label>
								<input
									type="date"
									id="date"
									value={formData.date}
									onChange={handleChange}
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-t_color mb-2">
									Lead Coach:
								</label>
								<select
									id="coach"
									value={formData.coach}
									onChange={handleChange}
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									required>
									<option value="">Select a coach</option>
									{coaches.map((coach) => (
										<option key={coach.id} value={coach.id}>
											{coach.name}
										</option>
									))}
								</select>
							</div>

							<button
								type="submit"
								disabled={loading}
								className={`bg-[#163B76] text-white px-4 py-2 rounded w-full ${
									loading
										? 'opacity-50 cursor-not-allowed'
										: 'hover:bg-blue-700'
								}`}>
								{loading ? 'Confirming...' : 'Confirm'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ScheduleSeminarModal;
