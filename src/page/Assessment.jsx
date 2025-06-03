import React, { useEffect, useState } from "react";
import { FaSearch, FaEnvelope } from "react-icons/fa";
import SeminarHeader from "./SeminarHeader";
import axiosInstance from "../component/axiosInstance";
import Assessmendivetail from "./AssessmentDetail";

const Assessment = ({ item }) => {
	const [participants, setParticipants] = useState([]);
	const [originalParticipants, setOriginalParticipants] = useState([]);
	const [selectedParticipant, setSelectedParticipant] = useState(null);
	const [selectLanguage, setSelectLanguage] = useState("english");

	// Fetch participants based on seminar ID
	const fetchParticipants = async (seminarId) => {
		try {
			const token = localStorage.getItem("token");
			const response = await axiosInstance.get(
				`/dashboard/participants/${seminarId}/`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setParticipants(response.data);
			setOriginalParticipants(response.data);
		} catch (err) {
			console.error("Failed to fetch participants:", err);
		}
	};

	useEffect(() => {
		if (item?.id) {
			fetchParticipants(item.id);
		}
	}, [item]);

	// Handle search functionality
	const handleSearch = (e) => {
		const searchTerm = e.target.value.toLowerCase();
		if (!searchTerm) {
			setParticipants(originalParticipants);
			return;
		}
		const filteredParticipants = originalParticipants.filter(
			(participant) =>
				`${participant.first_name} ${participant.last_name}`
					.toLowerCase()
					.includes(searchTerm)
		);
		setParticipants(filteredParticipants);
	};

	// Handle participant click with assessment check
	const handleParticipantClick = (participant) => {
		// if (participant.assessment_one && participant.assessment_two) {
		// 	alert("This user already has assessments completed.");
		// 	return;
		// }
		setSelectedParticipant(participant);
	};
	const handlePrevious = () => {
		const currentIndex = participants.findIndex(
			(p) => p.id === selectedParticipant.id
		);
		if (currentIndex > 0) {
			setSelectedParticipant(participants[currentIndex - 1]);
		}
	};

	const handleNext = () => {
		const currentIndex = participants.findIndex(
			(p) => p.id === selectedParticipant.id
		);
		if (currentIndex < participants.length - 1) {
			setSelectedParticipant(participants[currentIndex + 1]);
		}
	};

	return (
		<div className="min-h-screen text-white px-5">
			{/* Header Section */}
			<SeminarHeader
				button_name={"Start Mailing"}
				active={"Assessment"}
				data={item}
			/>

			{/* Controls Section */}
			<div className="flex items-center justify-between bg-[#28282A] mb-4 py-3 px-2 rounded-md">
				<h2 className="text-lg font-bold pl-2">ASSESSMENTS</h2>

				<div className="flex items-center justify-center gap-5">
					<div className="flex items-center gap-2">
						<p className="text-gray-400">Select Language:</p>
						<select
							className="bg-[#1E1E1F] text-white p-2 rounded"
							value={selectLanguage}
							onChange={(e) => setSelectLanguage(e.target.value)}
						>
							<option value="english">English</option>
							<option value="spanish">Spanish</option>
							<option value="french">French</option>
							<option value="german">German</option>
							<option value="italian">Italian</option>
							<option value="portuguese">Portuguese</option>
						</select>
					</div>

					{/* <div className="flex items-center gap-2">
						<p className="text-gray-400">Select Day:</p>
						<select
							className="bg-[#1E1E1F] text-white p-2 rounded"
							value={selectLanguage}
							onChange={(e) => setSelectLanguage(e.target.value)}
						>
							<option value="assessment1">Assessment 1</option>
							<option value="assessment1">Assessment 2</option>
						</select>
					</div> */}
				</div>

				<div className="relative w-[13vw] bg-[#1E1E1F] rounded">
					<input
						type="text"
						placeholder="Search by name"
						onChange={handleSearch}
						className="bg-[#1E1E1F] p-2 rounded text-white w-full pr-10"
					/>
					<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
						<FaSearch className="text-gray-400" />
					</div>
				</div>
			</div>

			{/* Main Layout */}
			<div className="flex gap-10">
				{/* Sidebar */}
				<div className="w-[8%]">
					<div className="border-b w-full flex items-center rounded-tr-md rounded-tl-md justify-center border-gray-700 bg-[#3E3E3E]">
						<div className="h-[5vh] font-bold text-gray-300 flex items-center justify-center">
							Name
						</div>
					</div>
					<ul className="w-full scroll h-[80vh] overflow-y-auto overscroll-y-none">
						{participants.map((participant, index) => (
							<li
								key={index}
								onClick={() =>
									handleParticipantClick(participant)
								}
								className={`py-2 px-2 text-center border-b border-gray-800 cursor-pointer ${
									participant.first_name ===
										selectedParticipant?.first_name &&
									participant.last_name ===
										selectedParticipant?.last_name
										? "bg-[#092147]"
										: "text-[#B0B4BF] hover:bg-[#1E1E1F]"
								}`}
							>
								{participant.first_name} {participant.last_name}
							</li>
						))}
					</ul>
				</div>

				{/* Main Content */}
				<div className="w-[90%]">
					<Assessmendivetail
						participant={selectedParticipant}
						selectLanguage={selectLanguage}
						handlePrevious={handlePrevious}
						handleNext={handleNext}
						selectedParticipant={selectedParticipant}
						participants={participants}
					/>
				</div>
			</div>
		</div>
	);
};

export default Assessment;
