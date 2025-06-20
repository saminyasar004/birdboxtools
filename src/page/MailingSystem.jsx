import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";
import { MdArrowBack } from "react-icons/md";
import SeminarHeader from "./SeminarHeader";
import axiosInstance from "../component/axiosInstance";

const MailingSystem = ({ item }) => {
	if (!item?.id) {
		return window.location.reload("/");
	}
	const [participants, setParticipants] = useState([]);
	const [selectedParticipant, setSelectedParticipant] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isSending, setIsSending] = useState(false);
	const dropdownRef = useRef(null);
	const [assessmentDay, setAssessmentDay] = useState("one");
	const [isMailBodyEdited, setIsMailBodyEdited] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch participants from the API
	useEffect(() => {
		const fetchParticipants = async () => {
			try {
				const response = await axiosInstance.get(
					`/dashboard/assessment/users/${item.id}/`
				);
				setParticipants(response.data);
				if (response.data.length > 0) {
					setSelectedParticipant(response.data[0]);
				}
				setLoading(false);
			} catch (err) {
				setError("Failed to fetch participants");
				setLoading(false);
			}
		};

		fetchParticipants();
	}, [item.id]);

	// Handle outside click to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Handle participant selection
	const handleParticipantClick = (participant) => {
		setSelectedParticipant(participant);
		setIsMailBodyEdited(false); // Reset edited flag when selecting a new participant
	};

	// Handle search filtering
	const filteredParticipants = participants.filter(
		(participant) =>
			participant.first_name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.last_name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			participant.id.toString().includes(searchQuery)
	);

	// Navigate to previous/next participant
	const handlePrevious = () => {
		const currentIndex = participants.findIndex(
			(p) => p.id === selectedParticipant.id
		);
		if (currentIndex > 0) {
			setSelectedParticipant(participants[currentIndex - 1]);
			setIsMailBodyEdited(false);
		}
	};

	const handleNext = () => {
		const currentIndex = participants.findIndex(
			(p) => p.id === selectedParticipant.id
		);
		if (currentIndex < participants.length - 1) {
			setSelectedParticipant(participants[currentIndex + 1]);
			setIsMailBodyEdited(false);
		}
	};

	// Update email body in participants array
	const updateParticipantEmailBody = (participantId, field, value) => {
		setParticipants((prev) =>
			prev.map((p) =>
				p.id === participantId ? { ...p, [field]: value } : p
			)
		);
		setSelectedParticipant((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	// Handle sending email for selected participant
	const handleSendEmail = async () => {
		if (!selectedParticipant) {
			alert("No participant selected");
			return;
		}
		setIsSending(true);
		try {
			const payload = {
				participants_id: selectedParticipant.id.toString(),
				seminar_id: item.id.toString(),
				assessment_number: assessmentDay,
			};
			if (isMailBodyEdited) {
				payload.assessment_number = assessmentDay;
			}
			await axiosInstance.post("/dashboard/send_assessment/", payload);
			alert("Email sent successfully!");
		} catch (err) {
			alert("Failed to send email");
		} finally {
			setIsSending(false);
			setIsOpen(false);
		}
	};

	// Handle sending emails for all participants
	const handleSendAllEmails = async () => {
		setIsSending(true);
		try {
			await axiosInstance.post("/dashboard/send_assessment/", {
				seminar_id: item.id.toString(),
				assessment_number: assessmentDay,
			});
			alert("Emails sent to all participants successfully!");
		} catch (err) {
			alert("Failed to send emails");
		} finally {
			setIsSending(false);
			setIsOpen(false);
		}
	};

	// Handle saving email body
	const handleSave = async () => {
		if (!selectedParticipant) {
			alert("No participant selected");
			return;
		}
		try {
			const payload = {
				assessment_number: assessmentDay,
				[assessmentDay === "one" ? "email_body" : "email_body_two"]:
					assessmentDay === "one"
						? selectedParticipant.email_body || ""
						: selectedParticipant.email_body_two || "",
			};
			const response = await axiosInstance.put(
				`/dashboard/get_assessment/${selectedParticipant.id}/`,
				payload
			);

			console.log("Response: ", response);

			if (response.status === 200) {
				alert("Email body saved successfully!");
			} else {
				alert("Failed to save email body");
			}
		} catch (err) {
			console.error("Error on saving: ", err);
			alert("Failed to save email body");
		}
	};

	if (loading) {
		return (
			<div className="text-t_color w-full flex items-center justify-center py-10">
				Loading...
			</div>
		);
	}

	if (error) {
		return <div className="text-t_color">{error}</div>;
	}

	return (
		<div className="min-h-screen px-10 bg-[#1E1E1E] text-t_color relative">
			{isSending && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="text-white text-xl font-bold">
						Sending...
					</div>
				</div>
			)}

			<SeminarHeader
				button_name={"Start Mailing"}
				active={"Start Mailing"}
				data={item}
			/>
			<div className="p-4 flex justify-between items-center">
				<h2 className="text-lg font-bold">Mailing system</h2>
				<span className="text-gray-400">
					{selectedParticipant?.first_name +
						" " +
						selectedParticipant?.last_name}
				</span>
			</div>
			<div className="flex flex-col w-full justify-between">
				<div className="w-full flex items-center justify-between py-3 bg-[#232325]">
					<table className="table">
						<thead>
							<tr>
								<th className="py-2 px-7">No.</th>
								<th className="py-2 px-7">First name</th>
								<th className="py-2 px-7">Last name</th>
							</tr>
						</thead>
					</table>
					<div className="flex items-center gap-2">
						<p className="text-gray-400">Select Day:</p>
						<select
							className="bg-[#1E1E1F] text-white p-2 rounded"
							value={assessmentDay}
							onChange={(e) => {
								setAssessmentDay(e.target.value);
								setIsMailBodyEdited(false); // Reset edited flag when changing assessment day
							}}
						>
							<option value="one">Assessment 1</option>
							<option value="two">Assessment 2</option>
						</select>
					</div>
					<div className="flex items-center px-5 mr-4 rounded-md py-3 bg-[#1C1C1D]">
						<input
							type="text"
							placeholder="Search by name or ID"
							className="rounded bg-[#1C1C1D] w-full text-t_color"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						<FaSearch className="text-gray-400" />
					</div>
				</div>

				<div className="flex justify-between px-5 py-5">
					<div className="w-1/4">
						<table className="w-full text-left">
							<tbody>
								{filteredParticipants.map((participant) => (
									<tr
										key={participant.id}
										className={`cursor-pointer ${
											selectedParticipant?.id ===
											participant.id
												? "bg-gray-700"
												: "hover:bg-gray-700"
										}`}
										onClick={() =>
											handleParticipantClick(participant)
										}
									>
										<td className="py-2">
											{participant.id}
										</td>
										<td className="py-2">
											{participant.first_name}
										</td>
										<td className="py-2">
											{participant.last_name}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="w-[70%] p-4 bg-[#28282A]">
						<div className="flex justify-between mb-4">
							<button className="py-2 rounded flex items-center gap-3">
								<MdArrowBack /> Back
							</button>
							<div
								className="relative flex items-center"
								ref={dropdownRef}
							>
								<button
									onClick={() => setIsOpen(!isOpen)}
									className="bg-blue-900 hover:bg-blue-700 px-4 py-1 rounded-md text-white font-semibold"
									disabled={isSending}
								>
									Send
								</button>
								{isOpen && (
									<div className="absolute top-12 z-50 -left-12 shadow-md px-2 py-3 w-[9vw] bg-[#141414] flex flex-col items-start">
										<button
											onClick={handleSendEmail}
											className="hover:bg-blue-900 w-full flex items-start px-1"
											disabled={isSending}
										>
											Send
										</button>
										<button
											onClick={handleSendAllEmails}
											className="hover:bg-blue-900 flex items-start w-full px-1"
											disabled={isSending}
										>
											Send to all Mails
										</button>
									</div>
								)}
							</div>
						</div>
						<div className="ml-4">
							<div className="mb-4 flex items-center gap-6 border-b border-[#2E2E30]">
								<label className="block text-sm font-bold mb-2 w-[10vw]">
									From
								</label>
								<input
									type="text"
									value="info@birdboxtools.com"
									readOnly
									className="w-full bg-[#28282A] rounded text-t_color"
								/>
							</div>
							<div className="mb-4 flex items-center gap-6 border-b border-[#2E2E30]">
								<label className="block text-sm font-bold mb-2 w-[10vw]">
									To
								</label>
								<input
									type="text"
									value={selectedParticipant?.email || ""}
									readOnly
									className="w-full bg-[#28282A] rounded text-t_color"
								/>
							</div>
							<div className="mb-4">
								{selectedParticipant[
									assessmentDay === "one"
										? "email_body"
										: "email_body_two"
								] ? (
									<textarea
										className="w-full bg-[#28282A] rounded text-t_color h-[20rem] outline-none resize-none"
										value={
											assessmentDay === "one"
												? selectedParticipant?.email_body ||
												  ""
												: selectedParticipant?.email_body_two ||
												  ""
										}
										onChange={(e) => {
											const field =
												assessmentDay === "one"
													? "email_body"
													: "email_body_two";
											updateParticipantEmailBody(
												selectedParticipant.id,
												field,
												e.target.value
											);
											setIsMailBodyEdited(true);
										}}
									/>
								) : (
									<p className="text-center text-sm">
										No assessment created
									</p>
								)}
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex justify-center items-center gap-3">
								<button
									className="px-4 py-2 flex items-center justify-center gap-3 rounded border border-[#BDC5DB]"
									onClick={handlePrevious}
									disabled={
										!selectedParticipant ||
										participants[0]?.id ===
											selectedParticipant.id
									}
								>
									<MdArrowBack /> Previous
								</button>
								<button
									className="px-4 py-2 flex items-center justify-center gap-3 rounded border border-[#BDC5DB]"
									onClick={handleNext}
									disabled={
										!selectedParticipant ||
										participants[participants.length - 1]
											?.id === selectedParticipant.id
									}
								>
									Next <IoArrowForward />
								</button>
							</div>
							<button
								onClick={handleSave}
								className="bg-blue-900 hover:bg-blue-700 px-4 py-1 rounded-md text-white font-semibold"
								disabled={!isMailBodyEdited}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MailingSystem;
