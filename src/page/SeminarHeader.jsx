import React from 'react';
import { FaCalendarAlt, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import { MdArrowForwardIos } from 'react-icons/md';
import { useCustomState } from '../component/StateContext';

const SeminarHeader = ({ button_name, active, data }) => {
	// Helper function to determine text color based on the active section
	const textColor = (name) =>
		active === name ? 'text-t_color' : 'text-[#66666B]';
	const {
		seminar,
		setSeminar,
		participant,
		setParticipant,
		assessment,
		setAssessment,
		mailSystem,
		setMailSystem,
	} = useCustomState();

	const handleNavigation = (page) => {
		setSeminar(false);
		setParticipant(false);
		setAssessment(false);
		setMailSystem(false);
		switch (page) {
			case 'seminar':
				setSeminar(true);
				break;
			case 'participant':
				setParticipant(true);
				break;
			case 'assessment':
				setAssessment(true);
				break;
			case 'mailSystem':
				setMailSystem(true);
				break;
			default:
				setSeminar(true);
		}
	};

	const handleNavigate = () => {
		setSeminar(false);
		setParticipant(false);
		setAssessment(false);
		setMailSystem(false);
		if (participant) {
			setAssessment(true);
		} else {
			setMailSystem(true);
		}
	};

	return (
		<div className="text-t_color text-[16px] border border-[#66666B] mb-3 rounded-md px-1">
			<div className="bg-[#2A2A2C]">
				<div className="text-white p-2 flex items-center gap-2 text-lg">
					<a
						onClick={() => handleNavigation('seminar')}
						className={`${textColor('Seminar list')} hover:underline`}>
						Seminar list
					</a>
					<MdArrowForwardIos className={`${textColor('Seminar list')}`} />
					<a
						onClick={() => handleNavigation('participant')}
						className={`${textColor('Participants')} hover:underline`}>
						Participants
					</a>
					<MdArrowForwardIos className={`${textColor('Participants')}`} />
					<a
						onClick={() => handleNavigation('assessment')}
						className={`${textColor('Assessment')} hover:underline`}>
						Assessment
					</a>
					<MdArrowForwardIos className={`${textColor('Assessment')}`} />
					<a
						onClick={() => handleNavigation('mailSystem')}
						className={`${textColor('Start Mailing')} hover:underline`}>
						Start Mailing
					</a>
					<MdArrowForwardIos className={`${textColor('Start Mailing')}`} />
				</div>
			</div>
			<div className="flex justify-between items-center px-4">
				<div className="flex items-center justify-between w-full 2xl:text-lg md:text-sm">
					<div>Seminar No: {data?.id}</div>
					<div className="h-[7vh] w-[1px] bg-[#66666B]"></div>
					<div>Location: {data?.location}</div>
					<div className="h-[7vh] w-[1px] bg-[#66666B]"></div>
					<div>
						<FaCalendarAlt className="inline mr-1 text-blue-500" /> Date:{' '}
						{data?.date}
					</div>
					<div className="h-[7vh] w-[1px] bg-[#66666B]"></div>
					<div>
						<FaUsers className="inline mr-1 text-blue-500" /> Total
						participants: {data?.participants_count}
					</div>
					<div className="h-[7vh] w-[1px] bg-[#66666B]"></div>
					<div>
						<FaChalkboardTeacher className="inline mr-1 text-blue-500" /> Lead
						coach: {data?.coach?.name}
					</div>
					<div className="h-[7vh] w-[1px] bg-[#66666B]"></div>
					<button
						onClick={handleNavigate}
						className="bg-[#092147] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						{button_name}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SeminarHeader;
