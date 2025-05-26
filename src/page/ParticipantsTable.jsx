/* eslint-disable react/prop-types */
import React, { useRef, useState, useEffect } from 'react';
import {
	FaPencilAlt,
	FaTrashAlt,
	FaPlus,
	FaSearch,
	FaCheckSquare,
	FaSquare,
} from 'react-icons/fa';
import SeminarHeader from './SeminarHeader';
import EditParticipantModal from '../component/EditParticipant';
import axiosInstance from '../component/axiosInstance';

const ParticipantsTable = ({
	fetchSeminarData,
	assessment,
	mailsystem,
	item,
}) => {
	const [participants, setParticipants] = useState([]);
	const [filteredParticipants, setFilteredParticipants] = useState([]); // New state for filtered participants
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [file, setFile] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState(''); // New state for search input
	const fileInputRef = useRef(null);
	const [participantId, setParticipantId] = useState(null);

	// Fetch participants when component mounts or seminar changes
	useEffect(() => {
		if (item?.id) {
			fetchParticipants(item.id);
		}
	}, [item]);

	// Update filtered participants when participants or search query changes
	useEffect(() => {
		const filtered = participants.filter((participant) =>
			[
				participant.id?.toString(),
				participant.firstName || participant.first_name,
				participant.lastName || participant.last_name,
				participant.email,
			].some((field) =>
				field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
		setFilteredParticipants(filtered);
	}, [participants, searchQuery]);

	const fetchParticipants = async (seminarId) => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await axiosInstance.get(
				`/dashboard/participants/${seminarId}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setParticipants(response.data);
			setFilteredParticipants(response.data); // Initialize filtered list
		} catch (err) {
			setError('Failed to fetch participants. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this participant?')) {
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.delete(
				`/dashboard/participant/${id}/delete/`
			);

			if (response.status === 204 || response.status === 200) {
				fetchParticipants(item.id); // Refresh participant list
			} else {
				throw new Error('Failed to delete participant');
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to delete participant. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	// Handle file selection
	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			setFile(selectedFile);
			setError('');
		}
	};

	// Handle import button click
	const handleImportClick = () => {
		setIsUploadModalOpen(true);
	};

	// Handle file upload submission
	const handleUploadSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			setError('Please select a file to upload');
			return;
		}
		if (!item?.id) {
			setError('Seminar ID not found');
			return;
		}

		setLoading(true);
		setError('');

		const formData = new FormData();
		formData.append('seminar_id', item.id);
		formData.append('file', file);

		try {
			const response = await axiosInstance.post(
				'/dashboard/participants/import/',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);

			setIsUploadModalOpen(false);
			setFile(null);
			fetchParticipants(item.id); // Refresh participant list
			fetchSeminarData();
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to import participants. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="text-t_color p-8">
			<SeminarHeader
				button_name={'Start Assessment'}
				active={'Participants'}
				data={item}
			/>

			<div className="mb-4">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center justify-center gap-4">
						<p>Participants list</p>
						<button
							onClick={handleImportClick}
							className="bg-[#092147] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
							disabled={loading}>
							<FaPlus className="mr-2" /> Import list
						</button>
					</div>
					<div className="flex bg-[#28282A] p-2 rounded px-4 justify-between items-center gap-4 2xl:w-[15vw]">
						<input
							className="bg-transparent border-none outline-none text-white placeholder-gray-300 focus:ring-0"
							placeholder="Search by ID and location"
							value={searchQuery}
							onChange={handleSearchChange}
						/>
						<button className="bg-[#535355] px-3 py-2 rounded-lg">
							<FaSearch className="w-5 h-5 text-gray-300" />
						</button>
					</div>
				</div>
			</div>

			{error && <div className="text-red-500 text-center mb-4">{error}</div>}

			{loading ? (
				<div className="text-center p-4 text-gray-500">
					Loading participants...
				</div>
			) : (
				<div className="h-[57vh] overflow-y-auto">
					<table className="min-w-full">
						<thead>
							<tr className="bg-[#28282A]">
								<th className="px-6 py-3 text-left">No.</th>
								<th className="px-6 py-3 text-left">First name</th>
								<th className="px-6 py-3 text-left">Last name</th>
								<th className="px-6 py-3 text-left">Assessment 1</th>
								<th className="px-6 py-3 text-left">Assessment 2</th>
								<th className="px-6 py-3 text-left">Day 1</th>
								<th className="px-6 py-3 text-left">Day 2</th>
								<th className="px-6 py-3 text-left">Email</th>
								<th className="px-6 py-3 text-left">Action</th>
							</tr>
						</thead>
						<tbody>
							{filteredParticipants.map((participant, index) => (
								<tr key={participant.id} className="border-t border-gray-700">
									<td className="px-6 py-4">{participant.id}</td>
									<td className="px-6 py-4">
										{participant.firstName || participant.first_name}
									</td>
									<td className="px-6 py-4">
										{participant.lastName || participant.last_name}
									</td>
									<td className="px-6 py-4">
										{participant.assessment_one ? (
											<FaCheckSquare color="#1E5DCC" className="mx-auto" />
										) : (
											<FaSquare color="#696969" className="mx-auto" />
										)}
									</td>
									<td className="px-6 py-4">
										{participant.assessment_two ? (
											<FaCheckSquare color="#1E5DCC" className="mx-auto" />
										) : (
											<FaSquare color="#696969" className="mx-auto" />
										)}
									</td>
									<td className="px-6 py-4">
										{participant.day_one ? (
											<FaCheckSquare color="#1E5DCC" className="mx-auto" />
										) : (
											<FaSquare color="#696969" className="mx-auto" />
										)}
									</td>
									<td className="px-6 py-4">
										{participant.day_two ? (
											<FaCheckSquare color="#1E5DCC" className="mx-auto" />
										) : (
											<FaSquare color="#696969" className="mx-auto" />
										)}
									</td>
									<td className="px-6 py-4">{participant.email}</td>
									<td className="px-6 py-4 flex items-center space-x-4">
										<button
											onClick={() => {
												setIsEditModalOpen(true);
												setParticipantId(participant);
											}}
											className="text-blue-500 hover:text-blue-600 border border-[#5285A7] px-2 py-1 rounded-md">
											<FaPencilAlt className="h-5 w-3" />
										</button>
										<button
											className="text-red-500 hover:text-red-600 border border-[#5285A7] px-2 py-1 rounded-md"
											onClick={() => handleDelete(participant.id)}>
											<FaTrashAlt className="h-5 w-3" />
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* File Upload Modal */}
			{isUploadModalOpen && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-[#0F0F0F] p-6 rounded-lg shadow-lg w-96">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-lg font-bold text-t_color">
								Import Participants
							</h2>
							<button
								onClick={() => setIsUploadModalOpen(false)}
								className="text-gray-400 hover:text-white"
								disabled={loading}>
								×
							</button>
						</div>

						<form onSubmit={handleUploadSubmit}>
							<div className="mb-4">
								<label className="block text-sm font-bold text-[#BDC5DB] mb-2">
									Upload File (CSV/XLS/XLSX)
								</label>
								<div className="relative">
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										accept=".csv, .xls, .xlsx"
										className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-700"
									/>
								</div>
								{file && (
									<p className="mt-2 text-sm text-gray-400">
										Selected: {file.name}
									</p>
								)}
							</div>
							<button
								type="submit"
								disabled={loading || !file}
								className={`w-full py-2 px-4 rounded text-white font-bold ${
									loading || !file
										? 'bg-gray-500 cursor-not-allowed'
										: 'bg-[#163B76] hover:bg-blue-700'
								}`}>
								{loading ? 'Uploading...' : 'Submit'}
							</button>
						</form>
					</div>
				</div>
			)}

			<EditParticipantModal
				setIsOpen={setIsEditModalOpen}
				isOpen={isEditModalOpen}
				participant={participantId}
				fetchParticipants={fetchParticipants}
			/>
		</div>
	);
};

export default ParticipantsTable;
