import { useEffect, useState } from 'react';
import Sidebar from '../component/Sidebar';

import axiosInstance from '../component/axiosInstance';

import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import icons from react-icons
import { FaPlus, FaSearch, FaSortAmountDown } from 'react-icons/fa'; // Import FontAwesome icons from react-icons
import AddCoachModal from '../component/AddCoachModal';

const CoachList = () => {
	const [userData, setUserData] = useState([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			const response = await axiosInstance.get('/accounts/coach-list/');

			if (response.status === 200) {
				console.log('✅ Chat List Fetched 33:', response.data);
				setUserData(response.data);
			} else {
				console.error('❌ Error fetching chat list:', response.data.error);
			}
		} catch (error) {
			console.error('❌ Error fetching chat list:', error.message);
		}
	};

	const [isOpen, setIsOpen] = useState(false);
	return (
		<Sidebar>
			<div className=" min-h-screen px-10">
				<div className=" text-t_color flex justify-between items-center p-4">
					<div className="flex items-center space-x-4">
						<h1 className="text-xl">Coach list</h1>
						<button
							onClick={() => setIsOpen(true)}
							className="bg-[#092147] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded inline-flex items-center">
							Add
							<FaPlus className="w-4 h-4 ml-2" />
						</button>
					</div>
					<div className="flex items-center space-x-4">
						<button className="bg-[#092147] hover:bg-gray-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
							<FaSortAmountDown className="w-4 h-4 mr-2" />
							Sort
						</button>
					</div>
				</div>
				<div className=" rounded-lg    overflow-x-auto ">
					{loading ? (
						<div className="text-center p-4 text-gray-500">Loading data...</div>
					) : (
						<div className="h-[70vh] overflow-y-auto">
							<table className="w-full text-t_color border-collapse  rounded-sm text-left ">
								<thead>
									<tr className="bg-[#28282A]">
										<th className="px-6 py-4">No</th>

										<th className="px-6 py-4">Name</th>
										<th className="px-6 py-4">Mobile Number</th>
										<th className="px-6 py-4">Email</th>
										<th className="px-6 py-4">Qualifications</th>
										<th className="px-6 py-4">Action</th>
									</tr>
								</thead>
								<tbody>
									{userData.map((item, index) => (
										<tr key={index} className="border-t border-gray-700">
											<td className="px-6 py-4">{item.id}</td>
											<td className="px-6 py-4">{item.name}</td>
											<td className="px-6 py-4">{item.phone}</td>
											<td className="px-6 py-4">{item.email}</td>
											<td className="px-6 py-4">{item.qualification}</td>

											<td className="px-6 py-4 flex items-center space-x-4">
												<button className="text-red-500 hover:text-red-600 border border-[#5285A7] px-2 py-1 rounded-md">
													<FaTrashAlt className="h-5 w-3" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
				<AddCoachModal
					setIsOpen={setIsOpen}
					isOpen={isOpen}
					fetchUser={fetchUser}
				/>
			</div>
		</Sidebar>
	);
};

export default CoachList;
