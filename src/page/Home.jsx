import { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { FaPlus, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import ParticipantsTable from './ParticipantsTable';
import MailingSystem from './MailingSystem';
import Assessment from './Assessment';
import ScheduleSeminarModal from '../component/ScheduleSeminarModal';
import { useCustomState } from '../component/StateContext';
import axiosInstance from '../component/axiosInstance';
import EditSeminar from '../component/EditSeminar';

const Home = () => {
	const [seminarData, setSeminarData] = useState([]);
	const [filteredSeminarData, setFilteredSeminarData] = useState([]); // New state for filtered seminars
	const [item, setItem] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState(''); // New state for search input

	useEffect(() => {
		fetchSeminarData();
	}, []);

	const fetchSeminarData = async () => {
		setLoading(true);
		try {
			const response = await axiosInstance.get('/dashboard/seminars/list/');

			if (response.status === 200) {
				setSeminarData(response.data);
				setFilteredSeminarData(response.data); // Initialize filtered list
			} else {
				setError('Failed to load seminars.');
			}
		} catch (error) {
			setError('Failed to load seminars. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	// Update filtered seminars when seminarData or searchQuery changes
	useEffect(() => {
		const filtered = seminarData.filter((seminar) =>
			[seminar.id?.toString(), seminar.location].some((field) =>
				field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
			)
		);
		setFilteredSeminarData(filtered);
	}, [seminarData, searchQuery]);

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this seminar?')) {
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.delete(
				`/dashboard/seminars/${id}/delete/`
			);

			if (response.status === 204 || response.status === 200) {
				const updatedSeminars = seminarData.filter(
					(seminar) => seminar.id !== id
				);
				setSeminarData(updatedSeminars);
				setFilteredSeminarData(updatedSeminars); // Update filtered list
			} else {
				throw new Error('Failed to delete seminar');
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to delete seminar. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	const {
		seminar,
		participant,
		assessment,
		mailSystem,
		setParticipant,
		setSeminar,
	} = useCustomState();

	const [isOpen, setIsOpen] = useState(false);
	const [isEditSeminar, setIsEditSeminar] = useState(false);
	const role = localStorage.getItem('role');

	// Handle search input change
	const handleSearchChange = (e) => {
		setSearchQuery(e.target.value);
	};

	return (
		<Sidebar>
			{seminar && (
				<div className="px-10">
					<div className="text-t_color flex justify-between items-center p-4">
						<div className="flex items-center space-x-4">
							<h1 className="text-xl">Seminar list</h1>
							{role === 'admin' && (
								<button
									onClick={() => setIsOpen(true)}
									className="bg-[#092147] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded inline-flex items-center"
									disabled={loading}>
									<FaPlus className="w-4 h-4 mr-2" />
									Add
								</button>
							)}
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex bg-[#28282A] p-2 rounded px-4 items-center gap-4">
								<input
									className="bg-transparent border-none outline-none text-white placeholder-gray-300 focus:ring-0"
									placeholder="Search by ID and location"
									value={searchQuery}
									onChange={handleSearchChange}
								/>
								<FaSearch className="w-5 h-5 text-gray-300" />
							</div>
						</div>
					</div>
					<div className="rounded-lg overflow-x-auto">
						{error && (
							<div className="text-red-500 text-center p-4">{error}</div>
						)}
						{loading ? (
							<div className="text-center p-4 text-gray-500">
								Loading data...
							</div>
						) : (
							<div className="h-[50vh] overflow-y-auto">
								<table className="w-full text-t_color border-collapse rounded-sm text-left">
									<thead>
										<tr className="bg-[#28282A]">
											<th className="px-6 py-4">No</th>
											<th className="px-6 py-4">Location</th>
											<th className="px-6 py-4">Date</th>
											<th className="px-6 py-4">Lead Coach</th>
											<th className="px-6 py-4">Participants</th>
											<th className="px-6 py-4">Status</th>
											{role === 'admin' && (
												<th className="px-6 py-4">Action</th>
											)}
										</tr>
									</thead>
									<tbody>
										{filteredSeminarData.map((item, index) => (
											<tr
												key={item.id}
												className="border-t border-gray-700 cursor-pointer"
												onClick={() => {
													setParticipant(true);
													setSeminar(false);
													setItem(item);
												}}>
												<td className="px-6 py-4">{item.id}</td>
												<td className="px-6 py-4">{item.location}</td>
												<td className="px-6 py-4">{item.date}</td>
												<td className="px-6 py-4">{item?.coach?.name}</td>
												<td className="px-6 py-4">{item.participants_count}</td>
												<td className="px-6 py-4">{item.status}</td>
												{role === 'admin' && (
													<td className="px-6 py-4 flex items-center space-x-4">
														<button
															className="text-blue-500 hover:text-blue-600"
															onClick={(e) => {
																e.stopPropagation();
																setIsEditSeminar(true);
																setItem(item);
															}}>
															<FaPencilAlt className="h-5 w-5" />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																handleDelete(item.id);
															}}
															className="text-red-500 hover:text-red-600"
															disabled={loading}>
															<FaTrashAlt className="h-5 w-5" />
														</button>
													</td>
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			)}

			{participant && (
				<ParticipantsTable item={item} fetchSeminarData={fetchSeminarData} />
			)}

			{assessment && <Assessment item={item} />}

			{mailSystem && <MailingSystem item={item} />}

			<ScheduleSeminarModal
				setIsOpen={setIsOpen}
				isOpen={isOpen}
				fetchSeminarData={fetchSeminarData}
			/>
			<EditSeminar
				setIsOpen={setIsEditSeminar}
				isOpen={isEditSeminar}
				fetchSeminarData={fetchSeminarData}
				data={item}
			/>
		</Sidebar>
	);
};

export default Home;
