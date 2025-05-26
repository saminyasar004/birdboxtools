import React, { useState } from 'react';
import axiosInstance from './axiosInstance';

const AddCoachModal = ({ isOpen, setIsOpen, fetchUser }) => {
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		password: 'defaultCoachPass123', // You might want to generate this or let admin set it
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		setError(''); // Clear error when typing
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.name || !formData.phone || !formData.email) {
			setError('Please fill in all fields');
			return;
		}
		if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			setError('Please enter a valid email');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/accounts/signup/', {
				name: formData.name,
				phone: formData.phone,
				email: formData.email,
				password: formData.password,
			});
			if (response.status === 201) {
				alert('Coach added successfully');
				setIsOpen(false); // Close modal on success
				fetchUser();
			}
		} catch (err) {
			setError(
				err.response?.data?.email || 'Failed to add coach. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-[#0F0F0F] p-6 rounded-lg shadow-lg w-96">
						<div className="flex justify-between items-center mb-4">
							<button
								onClick={() => setIsOpen(false)}
								className="text-gray-400 hover:text-white"
								disabled={loading}>
								← Back
							</button>
							<h2 className="text-lg text-t_color font-bold">Add Coach</h2>
							<span></span> {/* Placeholder for alignment */}
						</div>

						{error && (
							<div className="text-red-500 text-sm text-center mb-4">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									Name
								</label>
								<input
									type="text"
									id="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Enter name"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
									required
								/>
							</div>

							<div className="mb-4">
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									Mobile number
								</label>
								<input
									type="text"
									id="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="XXX-XXX-XXXX"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
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
									placeholder="coach@example.com"
									className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white"
									required
								/>
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

export default AddCoachModal;
