/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import axiosInstance from './axiosInstance';

// eslint-disable-next-line react/prop-types
const EditSeminar = ({ isOpen, setIsOpen, fetchSeminarData, data }) => {
	const [formData, setFormData] = useState({
		location: '',
		date: '',
		coach: '',
	});
	const [coaches, setCoaches] = useState([]);
	const [filteredCoaches, setFilteredCoaches] = useState([]); // New state for filtered coaches
	const [coachSearchQuery, setCoachSearchQuery] = useState(''); // New state for coach search
	const [isCoachDropdownOpen, setIsCoachDropdownOpen] = useState(false); // New state for dropdown visibility
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const coachDropdownRef = useRef(null); // Ref for handling outside clicks

	// Initialize form data with seminar details
	useEffect(() => {
		setFormData({
			location: data.location || '',
			date: data.date || '',
			coach: data.coach?.id || '', // Use coach ID
		});
	}, [data]);

	// Fetch coaches when modal opens
	useEffect(() => {
		if (isOpen) {
			const fetchCoaches = async () => {
				try {
					const response = await axiosInstance.get('/accounts/coach-list/');
					setCoaches(response.data);
					setFilteredCoaches(response.data); // Initialize filtered coaches
				} catch (err) {
					setError('Failed to load coaches. Please try again.');
				}
			};
			fetchCoaches();
		}
	}, [isOpen]);

	// Filter coaches based on search query
	useEffect(() => {
		const filtered = coaches.filter((coach) =>
			coach.name.toLowerCase().includes(coachSearchQuery.toLowerCase())
		);
		setFilteredCoaches(filtered);
	}, [coachSearchQuery, coaches]);

	// Handle input changes for form fields
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
		setError('');
	};

	// Handle coach selection
	const handleCoachSelect = (coach) => {
		setFormData((prev) => ({
			...prev,
			coach: coach.id,
		}));
		setCoachSearchQuery(coach.name); // Display selected coach name in input
		setIsCoachDropdownOpen(false);
	};

	// Handle coach search input
	const handleCoachSearchChange = (e) => {
		setCoachSearchQuery(e.target.value);
		setIsCoachDropdownOpen(true);
	};

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				coachDropdownRef.current &&
				!coachDropdownRef.current.contains(event.target)
			) {
				setIsCoachDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

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
			const response = await axiosInstance.put(
				`/dashboard/seminars/${data.id}/update/`,
				{
					location: formData.location,
					date: formData.date,
					coach: formData.coach, // Sending coach ID
				}
			);
			if (response.status === 200) {
				alert('Seminar updated successfully');
				setIsOpen(false);
				fetchSeminarData();
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to update seminar. Please try again.'
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
							<h2 className="text-lg font-bold text-t_color">Edit Seminar</h2>
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

							<div className="mb-4" ref={coachDropdownRef}>
								<label className="block text-sm font-bold text-t_color mb-2">
									Lead Coach
								</label>
								<div className="relative">
									<input
										type="text"
										value={coachSearchQuery}
										onChange={handleCoachSearchChange}
										onFocus={() => setIsCoachDropdownOpen(true)}
										placeholder="Search coaches..."
										className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									{isCoachDropdownOpen && (
										<ul className="absolute z-10 w-full bg-gray-800 border border-gray-700 rounded mt-1 max-h-40 overflow-y-auto">
											{filteredCoaches.length > 0 ? (
												filteredCoaches.map((coach) => (
													<li
														key={coach.id}
														onClick={() => handleCoachSelect(coach)}
														className="p-2 text-white hover:bg-gray-700 cursor-pointer">
														{coach.name}
													</li>
												))
											) : (
												<li className="p-2 text-gray-400">No coaches found</li>
											)}
										</ul>
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
								{loading ? 'Updating...' : 'Confirm'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default EditSeminar;
