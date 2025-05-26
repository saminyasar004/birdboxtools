/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { IoArrowForward } from 'react-icons/io5';
import { MdArrowBack } from 'react-icons/md';
import axiosInstance from '../component/axiosInstance';

const Assessmendivetail = ({
	participant,
	selectLanguage,
	handlePrevious,
	handleNext,
	selectedParticipant,
	participants,
}) => {
	console.log('participants[0]?.id', participants);

	// Initial data structure
	const initialData = {
		name: participant?.first_name || 'Simone',
		'We saw you coaching the': 'Strict toes to bar',
		'Warm up': 'Warm Up',
		'On a personal note': 'Always a pleasure working with you',
		RAMP: null,
		NAMESET: null,
		CoachingStyle: {
			Autocratic: null,
			Democratic: null,
			'Calls out reps': null,
			'General cues': null,
			'Moves with the group': null,
			'Empty reps': null,
			'Individual cues': null,
			'Individual considerations': null,
			Interventions: null,
			'Matches Personality': null,
		},
		TransformationalElements: {
			CHARISMA: {
				CHARISMA: null,
				Energetic: null,
				'Visual contact': null,
				'Varied Pitch and Tone': null,
				'Resonant voice': null,
				'Facial expressions': null,
				'Use of Pauses and Silences': null,
				'Hand Gestures': null,
				'Open body language': null,
				'Use of metaphors': null,
				'Expert in subjects': null,
			},
			'Coaching philosophy': null,
			'Intellectual Stimulation': null,
			'Idolized Influences': null,
			'Individual Considerations': null,
			Inspiration: null,
		},
		SensoryCoaching: {
			Contact: null,
			Breath: null,
			Balance: null,
			Stillness: null,
			Tension: null,
			Smoothness: null,
		},
		Personalities: {
			'Fast Thinkers': {
				'Determined, take charge, maybe inhibited and quiet because they are not the Alpha in the room':
					null,
				'Lighten up the room, happy, socially interactive in big group, will ask questions':
					null,
			},
			'Slow Thinkers': {
				'Quiet, socially interactive in person to person, will ask questions quietly during breaks':
					null,
				'Systematic, deep thinkers, will ask lots of questions': null,
			},
		},
	};

	// State for text inputs
	const [textInputs, setTextInputs] = useState({
		'We saw you coaching the': initialData['We saw you coaching the'],
		'On a personal note': initialData['On a personal note'],
	});

	// State for image upload
	const [profileImage, setProfileImage] = useState(
		'https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg'
	);
	const [imageFile, setImageFile] = useState(null);

	// State for language (assuming this is passed or selected elsewhere)

	// State to manage checked status with mutual exclusivity
	const [checkedItems, setCheckedItems] = useState({
		'ramp-0-yes': initialData.RAMP === true,
		'ramp-0-no': initialData.RAMP === false,
		'nameset-0-yes': initialData.NAMESET === true,
		'nameset-0-no': initialData.NAMESET === false,
		...Object.keys(initialData.CoachingStyle).reduce(
			(acc, key, index) => ({
				...acc,
				[`coaching-left-${index}-yes`]:
					key === 'Autocratic' ||
					key === 'Democratic' ||
					key === 'Calls out reps' ||
					key === 'General cues' ||
					key === 'Moves with the group'
						? initialData.CoachingStyle[key] === true
						: false,
				[`coaching-left-${index}-no`]:
					key === 'Autocratic' ||
					key === 'Democratic' ||
					key === 'Calls out reps' ||
					key === 'General cues' ||
					key === 'Moves with the group'
						? initialData.CoachingStyle[key] === false
						: false,
				[`coaching-right-${index}-yes`]:
					key === 'Empty reps' ||
					key === 'Individual considerations' ||
					key === 'Matches Personality'
						? initialData.CoachingStyle[key] === true
						: false,
				[`coaching-right-${index}-no`]:
					key === 'Empty reps' ||
					key === 'Individual considerations' ||
					key === 'Matches Personality'
						? initialData.CoachingStyle[key] === false
						: false,
			}),
			{}
		),
		...Object.keys(initialData.TransformationalElements.CHARISMA).reduce(
			(acc, key, index) => ({
				...acc,
				[`charisma-left-${index}-yes`]:
					key === 'Energetic' ||
					key === 'Visual contact' ||
					key === 'Varied Pitch and Tone' ||
					key === 'Resonant voice' ||
					key === 'Facial expressions'
						? initialData.TransformationalElements.CHARISMA[key] === true
						: false,
				[`charisma-left-${index}-no`]:
					key === 'Energetic' ||
					key === 'Visual contact' ||
					key === 'Varied Pitch and Tone' ||
					key === 'Resonant voice' ||
					key === 'Facial expressions'
						? initialData.TransformationalElements.CHARISMA[key] === false
						: false,
				[`charisma-right-${index}-yes`]:
					key === 'Use of Pauses and Silences' ||
					key === 'Hand Gestures' ||
					key === 'Open body language' ||
					key === 'Use of metaphors' ||
					key === 'Expert in subjects'
						? initialData.TransformationalElements.CHARISMA[key] === true
						: false,
				[`charisma-right-${index}-no`]:
					key === 'Use of Pauses and Silences' ||
					key === 'Hand Gestures' ||
					key === 'Open body language' ||
					key === 'Use of metaphors' ||
					key === 'Expert in subjects'
						? initialData.TransformationalElements.CHARISMA[key] === false
						: false,
			}),
			{}
		),
		...Object.entries({
			'Coaching philosophy':
				initialData.TransformationalElements['Coaching philosophy'],
			'Intellectual Stimulation':
				initialData.TransformationalElements['Intellectual Stimulation'],
			'Idolized Influences':
				initialData.TransformationalElements['Idolized Influences'],
			'Individual Considerations':
				initialData.TransformationalElements['Individual Considerations'],
			Inspiration: initialData.TransformationalElements.Inspiration,
		}).reduce(
			(acc, [key, value], index) => ({
				...acc,
				[`transformational-${index}-yes`]: value === true,
				[`transformational-${index}-no`]: value === false,
			}),
			{}
		),
		...Object.keys(initialData.SensoryCoaching).reduce(
			(acc, key, index) => ({
				...acc,
				[`sensory-${index}-yes`]: initialData.SensoryCoaching[key] === true,
				[`sensory-${index}-no`]: initialData.SensoryCoaching[key] === false,
			}),
			{}
		),
		...Object.keys(initialData.Personalities['Fast Thinkers']).reduce(
			(acc, key, index) => ({
				...acc,
				[`personalities-1-${index}-yes`]:
					key !== 'Fast Thinkers'
						? initialData.Personalities['Fast Thinkers'][key] === true
						: false,
				[`personalities-1-${index}-no`]:
					key !== 'Fast Thinkers'
						? initialData.Personalities['Fast Thinkers'][key] === false
						: false,
			}),
			{}
		),
		...Object.keys(initialData.Personalities['Slow Thinkers']).reduce(
			(acc, key, index) => ({
				...acc,
				[`personalities-2-${index}-yes`]:
					key !== 'Slow Thinkers'
						? initialData.Personalities['Slow Thinkers'][key] === true
						: false,
				[`personalities-2-${index}-no`]:
					key !== 'Slow Thinkers'
						? initialData.Personalities['Slow Thinkers'][key] === false
						: false,
			}),
			{}
		),
	});

	// Function to toggle Yes/No check state with mutual exclusivity
	const toggleCheck = (section, itemIndex, type) => {
		const yesKey = `${section}-${itemIndex}-yes`;
		const noKey = `${section}-${itemIndex}-no`;
		setCheckedItems((prev) => ({
			...prev,
			[yesKey]: type === 'yes' ? !prev[yesKey] : false,
			[noKey]: type === 'no' ? !prev[noKey] : false,
		}));
	};

	// Function to handle text input changes
	const handleTextChange = (key, value) => {
		setTextInputs((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	// Function to handle image upload
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProfileImage(imageUrl);
			setImageFile(file);
		}
	};

	// Function to reset all fields
	const resetForm = () => {
		setTextInputs({
			'We saw you coaching the': '',
			'On a personal note': '',
		});
		setProfileImage(
			'https://t4.ftcdn.net/jpg/02/14/74/61/360_F_214746128_31JkeaP6rU0NzzzdFC4khGkmqc8noe6h.jpg'
		);
		setImageFile(null);

		setCheckedItems({
			'ramp-0-yes': false,
			'ramp-0-no': false,
			'nameset-0-yes': false,
			'nameset-0-no': false,
			...Object.keys(initialData.CoachingStyle).reduce(
				(acc, key, index) => ({
					...acc,
					[`coaching-left-${index}-yes`]: false,
					[`coaching-left-${index}-no`]: false,
					[`coaching-right-${index}-yes`]: false,
					[`coaching-right-${index}-no`]: false,
				}),
				{}
			),
			...Object.keys(initialData.TransformationalElements.CHARISMA).reduce(
				(acc, key, index) => ({
					...acc,
					[`charisma-left-${index}-yes`]: false,
					[`charisma-left-${index}-no`]: false,
					[`charisma-right-${index}-yes`]: false,
					[`charisma-right-${index}-no`]: false,
				}),
				{}
			),
			...Object.entries({
				'Coaching philosophy': null,
				'Intellectual Stimulation': null,
				'Idolized Influences': null,
				'Individual Considerations': null,
				Inspiration: null,
			}).reduce(
				(acc, [_, __], index) => ({
					...acc,
					[`transformational-${index}-yes`]: false,
					[`transformational-${index}-no`]: false,
				}),
				{}
			),
			...Object.keys(initialData.SensoryCoaching).reduce(
				(acc, key, index) => ({
					...acc,
					[`sensory-${index}-yes`]: false,
					[`sensory-${index}-no`]: false,
				}),
				{}
			),
			...Object.keys(initialData.Personalities['Fast Thinkers']).reduce(
				(acc, key, index) => ({
					...acc,
					[`personalities-1-${index}-yes`]: false,
					[`personalities-1-${index}-no`]: false,
				}),
				{}
			),
			...Object.keys(initialData.Personalities['Slow Thinkers']).reduce(
				(acc, key, index) => ({
					...acc,
					[`personalities-2-${index}-yes`]: false,
					[`personalities-2-${index}-no`]: false,
				}),
				{}
			),
		});
	};

	// Function to construct the assessment JSON
	const constructAssessmentData = () => {
		return {
			name: initialData.name,
			'We saw you coaching the': textInputs['We saw you coaching the'],
			'Warm up': initialData['Warm up'],
			'On a personal note': textInputs['On a personal note'],
			RAMP: checkedItems['ramp-0-yes']
				? true
				: checkedItems['ramp-0-no']
				? false
				: null,
			NAMESET: checkedItems['nameset-0-yes']
				? true
				: checkedItems['nameset-0-no']
				? false
				: null,
			CoachingStyle: {
				Autocratic: checkedItems['coaching-left-0-yes']
					? true
					: checkedItems['coaching-left-0-no']
					? false
					: null,
				Democratic: checkedItems['coaching-left-1-yes']
					? true
					: checkedItems['coaching-left-1-no']
					? false
					: null,
				'Calls out reps': checkedItems['coaching-left-2-yes']
					? true
					: checkedItems['coaching-left-2-no']
					? false
					: null,
				'General cues': checkedItems['coaching-left-3-yes']
					? true
					: checkedItems['coaching-left-3-no']
					? false
					: null,
				'Moves with the group': checkedItems['coaching-left-4-yes']
					? true
					: checkedItems['coaching-left-4-no']
					? false
					: null,
				'Empty reps': checkedItems['coaching-right-0-yes']
					? true
					: checkedItems['coaching-right-0-no']
					? false
					: null,
				'Individual considerations': checkedItems['coaching-right-1-yes']
					? true
					: checkedItems['coaching-right-1-no']
					? false
					: null,
				'Matches Personality': checkedItems['coaching-right-2-yes']
					? true
					: checkedItems['coaching-right-2-no']
					? false
					: null,
				'Individual cues': null,
				Interventions: null,
			},
			TransformationalElements: {
				CHARISMA: {
					CHARISMA: null,
					Energetic: checkedItems['charisma-left-0-yes']
						? true
						: checkedItems['charisma-left-0-no']
						? false
						: null,
					'Visual contact': checkedItems['charisma-left-1-yes']
						? true
						: checkedItems['charisma-left-1-no']
						? false
						: null,
					'Varied Pitch and Tone': checkedItems['charisma-left-2-yes']
						? true
						: checkedItems['charisma-left-2-no']
						? false
						: null,
					'Resonant voice': checkedItems['charisma-left-3-yes']
						? true
						: checkedItems['charisma-left-3-no']
						? false
						: null,
					'Facial expressions': checkedItems['charisma-left-4-yes']
						? true
						: checkedItems['charisma-left-4-no']
						? false
						: null,
					'Use of Pauses and Silences': checkedItems['charisma-right-0-yes']
						? true
						: checkedItems['charisma-right-0-no']
						? false
						: null,
					'Hand Gestures': checkedItems['charisma-right-1-yes']
						? true
						: checkedItems['charisma-right-1-no']
						? false
						: null,
					'Open body language': checkedItems['charisma-right-2-yes']
						? true
						: checkedItems['charisma-right-2-no']
						? false
						: null,
					'Use of metaphors': checkedItems['charisma-right-3-yes']
						? true
						: checkedItems['charisma-right-3-no']
						? false
						: null,
					'Expert in subjects': checkedItems['charisma-right-4-yes']
						? true
						: checkedItems['charisma-right-4-no']
						? false
						: null,
				},
				'Coaching philosophy': checkedItems['transformational-0-yes']
					? true
					: checkedItems['transformational-0-no']
					? false
					: null,
				'Intellectual Stimulation': checkedItems['transformational-1-yes']
					? true
					: checkedItems['transformational-1-no']
					? false
					: null,
				'Idolized Influences': checkedItems['transformational-2-yes']
					? true
					: checkedItems['transformational-2-no']
					? false
					: null,
				'Individual Considerations': checkedItems['transformational-3-yes']
					? true
					: checkedItems['transformational-3-no']
					? false
					: null,
				Inspiration: checkedItems['transformational-4-yes']
					? true
					: checkedItems['transformational-4-no']
					? false
					: null,
			},
			SensoryCoaching: {
				Contact: checkedItems['sensory-0-yes']
					? true
					: checkedItems['sensory-0-no']
					? false
					: null,
				Breath: checkedItems['sensory-1-yes']
					? true
					: checkedItems['sensory-1-no']
					? false
					: null,
				Balance: checkedItems['sensory-2-yes']
					? true
					: checkedItems['sensory-2-no']
					? false
					: null,
				Stillness: checkedItems['sensory-3-yes']
					? true
					: checkedItems['sensory-3-no']
					? false
					: null,
				Tension: checkedItems['sensory-4-yes']
					? true
					: checkedItems['sensory-4-no']
					? false
					: null,
				Smoothness: checkedItems['sensory-5-yes']
					? true
					: checkedItems['sensory-5-no']
					? false
					: null,
			},
			Personalities: {
				'Fast Thinkers': {
					'Determined, take charge, maybe inhibited and quiet because they are not the Alpha in the room':
						checkedItems['personalities-1-0-yes']
							? true
							: checkedItems['personalities-1-0-no']
							? false
							: null,
					'Lighten up the room, happy, socially interactive in big group, will ask questions':
						checkedItems['personalities-1-1-yes']
							? true
							: checkedItems['personalities-1-1-no']
							? false
							: null,
				},
				'Slow Thinkers': {
					'Quiet, socially interactive in person to person, will ask questions quietly during breaks':
						checkedItems['personalities-2-0-yes']
							? true
							: checkedItems['personalities-2-0-no']
							? false
							: null,
					'Systematic, deep thinkers, will ask lots of questions': checkedItems[
						'personalities-2-1-yes'
					]
						? true
						: checkedItems['personalities-2-1-no']
						? false
						: null,
				},
			},
		};
	};

	// Function to validate required fields
	const validateForm = () => {
		const assessmentData = constructAssessmentData();

		// Check text inputs
		if (
			!textInputs['We saw you coaching the'] ||
			!textInputs['On a personal note']
		) {
			alert(
				'Please fill out all text fields: "We saw you coaching the" and "On a personal note".'
			);
			return false;
		}

		// Check language
		if (!selectLanguage) {
			alert('Please select a language.');
			return false;
		}

		// Check RAMP and NAMESET
		if (assessmentData.RAMP === null || assessmentData.NAMESET === null) {
			alert('Please select Yes or No for RAMP and NAMESET.');
			return false;
		}

		// Check CoachingStyle (all displayed fields must be set)
		const coachingFields = [
			'Autocratic',
			'Democratic',
			'Calls out reps',
			'General cues',
			'Moves with the group',
			'Empty reps',
			'Individual considerations',
			'Matches Personality',
		];
		for (let i = 0; i < coachingFields.length; i++) {
			const yesKey =
				i < 5 ? `coaching-left-${i}-yes` : `coaching-right-${i - 5}-yes`;
			const noKey =
				i < 5 ? `coaching-left-${i}-no` : `coaching-right-${i - 5}-no`;
			if (!checkedItems[yesKey] && !checkedItems[noKey]) {
				alert(
					`Please select Yes or No for "${coachingFields[i]}" in Coaching Style.`
				);
				return false;
			}
		}

		// Check CHARISMA (all displayed fields must be set)
		const charismaFields = [
			'Energetic',
			'Visual contact',
			'Varied Pitch and Tone',
			'Resonant voice',
			'Facial expressions',
			'Use of Pauses and Silences',
			'Hand Gestures',
			'Open body language',
			'Use of metaphors',
			'Expert in subjects',
		];
		for (let i = 0; i < charismaFields.length; i++) {
			const yesKey =
				i < 5 ? `charisma-left-${i}-yes` : `charisma-right-${i - 5}-yes`;
			const noKey =
				i < 5 ? `charisma-left-${i}-no` : `charisma-right-${i - 5}-no`;
			if (!checkedItems[yesKey] && !checkedItems[noKey]) {
				alert(
					`Please select Yes or No for "${charismaFields[i]}" in CHARISMA.`
				);
				return false;
			}
		}

		// Check TransformationalElements (non-CHARISMA fields)
		const transformationalFields = [
			'Coaching philosophy',
			'Intellectual Stimulation',
			'Idolized Influences',
			'Individual Considerations',
			'Inspiration',
		];
		for (let i = 0; i < transformationalFields.length; i++) {
			if (
				assessmentData.TransformationalElements[transformationalFields[i]] ===
				null
			) {
				alert(
					`Please select Yes or No for "${transformationalFields[i]}" in Transformational Elements.`
				);
				return false;
			}
		}

		// Check SensoryCoaching
		const sensoryFields = [
			'Contact',
			'Breath',
			'Balance',
			'Stillness',
			'Tension',
			'Smoothness',
		];
		for (let i = 0; i < sensoryFields.length; i++) {
			if (assessmentData.SensoryCoaching[sensoryFields[i]] === null) {
				alert(
					`Please select Yes or No for "${sensoryFields[i]}" in Sensory Coaching.`
				);
				return false;
			}
		}

		// Check Personalities
		const fastThinkerFields = Object.keys(
			initialData.Personalities['Fast Thinkers']
		);
		const slowThinkerFields = Object.keys(
			initialData.Personalities['Slow Thinkers']
		);
		for (let i = 0; i < fastThinkerFields.length; i++) {
			if (
				assessmentData.Personalities['Fast Thinkers'][fastThinkerFields[i]] ===
				null
			) {
				alert(
					`Please select Yes or No for "${fastThinkerFields[i]}" in Fast Thinkers.`
				);
				return false;
			}
		}
		for (let i = 0; i < slowThinkerFields.length; i++) {
			if (
				assessmentData.Personalities['Slow Thinkers'][slowThinkerFields[i]] ===
				null
			) {
				alert(
					`Please select Yes or No for "${slowThinkerFields[i]}" in Slow Thinkers.`
				);
				return false;
			}
		}

		return true;
	};

	const [isLoading, setIsLoading] = useState(false);

	// Function to handle form submission
	const handleConfirm = async () => {
		if (participant === null) {
			alert('Please select a participant');
			return;
		}

		if (!validateForm()) {
			return;
		}
		setIsLoading(true);
		const assessmentData = constructAssessmentData();
		const formData = new FormData();
		console.log('Form Data:', JSON.stringify(assessmentData));
		formData.append('assessment', JSON.stringify(assessmentData));
		formData.append('language', selectLanguage);
		if (imageFile) {
			formData.append('profile_image', imageFile);
		}

		try {
			const response = await axiosInstance.post(
				`/dashboard/assessment/${participant?.id}/`,
				formData
			);

			if (response.status === 200 || response.status === 201) {
				console.log('Assessment saved successfully:', response.data);
				alert('Assessment saved successfully!');
				resetForm(); // Clear all fields after successful submission
			} else {
				console.error('Failed to save assessment:', response.statusText);
				alert('Failed to save assessment.');
			}
		} catch (error) {
			console.error('Error submitting assessment:', error);
			alert('An error occurred while saving the assessment.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#28282A] text-[14px] text-white p-4">
			{/* Main Layout */}
			<div className="flex flex-col lg:flex-row bg-[#28282A] shadow-lg border border-gray-700">
				{/* Left Profile Section */}
				<div className="w-full 2xl:w-1/3 bg-[#28282A] rounded-t lg:rounded-l">
					<div className="flex flex-row items-center border border-[#3E3E3E] justify-center gap-4 py-6">
						<label className="cursor-pointer">
							<input
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								required
							/>
							<img
								src={profileImage}
								alt="Profile"
								className="w-24 h-24 rounded-full mb-2 object-cover"
							/>
						</label>
						<div className="text-center">
							<h3 className="text-lg text-[#B0B4BF] text-[15px]">Name</h3>
							<p className="text-[#B0B4BF] text-[15px]">{initialData.name}</p>
						</div>
					</div>
					<div className="border-l border-r border-[#3E3E3E]">
						<p className="font-bold bg-[#1C1C1D] text-center py-3 text-gray-300">
							Your Personality is perceived as
						</p>
						<div className="border-b border-t border-[#3E3E3E] flex items-center justify-evenly px-2 py-2">
							We saw you coaching the{' '}
							<div className="h-[5vh] w-[1px] bg-[#3E3E3E]"></div>
							<div className="truncate">{initialData['Warm up']}</div>
						</div>
					</div>
					<div className="border-l border-r border-b border-gray-700">
						<p className="font-bold border-b bg-[#3E3E3E] border-[#3E3E3E] text-center py-2 text-gray-300">
							We saw you coaching the
						</p>
						<div className="p-2 h-[21vh] flex items-center justify-center text-center mt-2 overflow-hidden">
							<textarea
								className="w-full h-[20vh] bg-[#28282A] text-white border-gray-500 rounded p-2 resize-none"
								value={textInputs['We saw you coaching the']}
								onChange={(e) =>
									handleTextChange('We saw you coaching the', e.target.value)
								}
								required
							/>
						</div>
					</div>
					<div className="border-[#3E3E3E]">
						<p className="font-bold bg-[#3E3E3E] text-center py-2 text-gray-300">
							On a personal Note
						</p>
						<div className="text-center flex items-center justify-center h-[21vh] p-2 mt-2 overflow-hidden">
							<textarea
								className="w-full h-[20vh] bg-[#28282A] text-white border-gray-500 rounded p-2 resize-none"
								value={textInputs['On a personal note']}
								onChange={(e) =>
									handleTextChange('On a personal note', e.target.value)
								}
								required
							/>
						</div>
					</div>
				</div>

				{/* Right Table Section */}
				<div className="w-full 2xl:w-2/3 bg-[#28282A] overflow-x-auto rounded-b lg:rounded-r">
					<table className="w-full text-left">
						<tbody>
							<div className="w-full">
								<div className="border border-gray-700 flex flex-col lg:flex-row items-center w-full">
									<div className="h-[25vh] w-full lg:w-[10vw] flex flex-col items-center justify-center gap-2 px-2">
										<div className="truncate">RAMP</div>
										<div className="flex gap-2">
											<label className="flex items-center gap-1">
												<input
													type="checkbox"
													checked={checkedItems['ramp-0-yes']}
													onChange={() => toggleCheck('ramp', 0, 'yes')}
													className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
													required
												/>
												Yes
											</label>
											<label className="flex items-center gap-1">
												<input
													type="checkbox"
													checked={checkedItems['ramp-0-no']}
													onChange={() => toggleCheck('ramp', 0, 'no')}
													className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
													required
												/>
												No
											</label>
										</div>
									</div>
									<div className="border-t lg:border-t-0 lg:border-l lg:border-r h-[25vh] border-gray-700 w-full lg:w-[10vw] flex flex-col items-center justify-center gap-2 px-2">
										<div className="truncate">NAMESET</div>
										<div className="flex gap-2">
											<label className="flex items-center gap-1">
												<input
													type="checkbox"
													checked={checkedItems['nameset-0-yes']}
													onChange={() => toggleCheck('nameset', 0, 'yes')}
													className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
													required
												/>
												Yes
											</label>
											<label className="flex items-center gap-1">
												<input
													type="checkbox"
													checked={checkedItems['nameset-0-no']}
													onChange={() => toggleCheck('nameset', 0, 'no')}
													className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
													required
												/>
												No
											</label>
										</div>
									</div>
									<div className="w-full">
										<div className="border-t lg:border-t-0 border-b w-full flex items-center justify-center border-gray-700 bg-[#1C1C1D]">
											<div
												className="py-3 font-bold text-gray-300 truncate"
												colSpan="4">
												Coaching Style
											</div>
										</div>
										<div className="w-full">
											{[
												{ left: 'Autocratic', right: 'Empty reps' },
												{
													left: 'Democratic',
													right: 'Individual considerations',
												},
												{
													left: 'Calls out reps',
													right: 'Matches Personality',
												},
												{ left: 'General cues', right: 'Matches Personality' },
												{
													left: 'Moves with the group',
													right: 'Matches Personality',
												},
											].map((item, index) => (
												<div
													key={index}
													className="border-b border-gray-700 w-full flex flex-col lg:flex-row items-center justify-between px-4">
													<div className="flex items-center gap-2">
														<div className="py-2 w-full lg:w-[8vw] truncate">
															{item.left}
														</div>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`coaching-left-${index}-yes`]
																}
																onChange={() =>
																	toggleCheck('coaching-left', index, 'yes')
																}
																className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															Yes
														</label>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`coaching-left-${index}-no`]
																}
																onChange={() =>
																	toggleCheck('coaching-left', index, 'no')
																}
																className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															No
														</label>
														<div className="hidden lg:block h-[4vh] w-[1px] bg-[#3E3E3E]"></div>
													</div>
													<div className="flex items-center gap-2">
														<div className="py-2 truncate">{item.right}</div>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`coaching-right-${index}-yes`]
																}
																onChange={() =>
																	toggleCheck('coaching-right', index, 'yes')
																}
																className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															Yes
														</label>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`coaching-right-${index}-no`]
																}
																onChange={() =>
																	toggleCheck('coaching-right', index, 'no')
																}
																className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															No
														</label>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Transformational Elements */}
							<div className="border-r border-l border-b border-gray-700">
								<div className="w-full flex items-center border-b justify-center border-gray-700 bg-[#1C1C1D]">
									<div
										className="py-2 font-bold text-gray-300 truncate"
										colSpan="4">
										Transformational Elements
									</div>
								</div>
								<div className="flex flex-col lg:flex-row justify-between items-center w-full">
									<div className="w-full lg:w-[70%] border-r border-gray-700">
										<div className="border-b w-full flex items-center justify-center border-gray-700 bg-[#3E3E3E]">
											<div
												className="py-2 font-bold text-gray-300 truncate"
												colSpan="4">
												CHARISMA
											</div>
										</div>
										<div className="flex flex-col">
											{[
												{
													left: 'Energetic',
													right: 'Use of Pauses and Silences',
												},
												{ left: 'Visual contact', right: 'Hand Gestures' },
												{
													left: 'Varied Pitch and Tone',
													right: 'Open body language',
												},
												{ left: 'Resonant voice', right: 'Use of metaphors' },
												{
													left: 'Facial expressions',
													right: 'Expert in subjects',
												},
											].map((item, index) => (
												<div
													key={index}
													className="border-b border-gray-700 w-full flex flex-col lg:flex-row items-center justify-between px-4">
													<div className="flex items-center gap-2">
														<div className="py-2 w-full lg:w-[12vw] truncate">
															{item.left}
														</div>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`charisma-left-${index}-yes`]
																}
																onChange={() =>
																	toggleCheck('charisma-left', index, 'yes')
																}
																className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															Yes
														</label>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`charisma-left-${index}-no`]
																}
																onChange={() =>
																	toggleCheck('charisma-left', index, 'no')
																}
																className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															No
														</label>
														<div className="hidden lg:block h-[4vh] w-[1px] bg-[#3E3E3E]"></div>
													</div>
													<div className="flex items-center gap-2">
														<div className="py-2 truncate">{item.right}</div>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`charisma-right-${index}-yes`]
																}
																onChange={() =>
																	toggleCheck('charisma-right', index, 'yes')
																}
																className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															Yes
														</label>
														<label className="flex items-center gap-1">
															<input
																type="checkbox"
																checked={
																	checkedItems[`charisma-right-${index}-no`]
																}
																onChange={() =>
																	toggleCheck('charisma-right', index, 'no')
																}
																className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
																required
															/>
															No
														</label>
													</div>
												</div>
											))}
										</div>
									</div>
									<div className="w-full lg:w-[40%]">
										{[
											'Coaching philosophy',
											'Intellectual Stimulation',
											'Idolized Influences',
											'Individual Considerations',
											'Inspiration',
										].map((item, index) => (
											<div
												key={index}
												className="border-b border-gray-700 h-[5vh] flex items-center justify-between px-4">
												<div className="text-center truncate w-[70%]">
													{item}
												</div>
												<div className="flex gap-2">
													<label className="flex items-center gap-1">
														<input
															type="checkbox"
															checked={
																checkedItems[`transformational-${index}-yes`]
															}
															onChange={() =>
																toggleCheck('transformational', index, 'yes')
															}
															className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
															required
														/>
														Yes
													</label>
													<label className="flex items-center gap-1">
														<input
															type="checkbox"
															checked={
																checkedItems[`transformational-${index}-no`]
															}
															onChange={() =>
																toggleCheck('transformational', index, 'no')
															}
															className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
															required
														/>
														No
													</label>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Sensory Coaching and Personalities */}
							<div className="flex flex-col lg:flex-row justify-between w-full border-l border-r border-gray-700">
								<div className="w-full lg:w-[30%] border-r border-gray-700">
									<div className="border-b w-full flex items-center justify-center border-gray-700 bg-[#3E3E3E]">
										<div
											className="h-[5vh] font-bold text-gray-300 flex items-center justify-center truncate"
											colSpan="4">
											SENSORY COACHING
										</div>
									</div>
									{[
										'Contact',
										'Breath',
										'Balance',
										'Stillness',
										'Tension',
										'Smoothness',
									].map((item, index) => (
										<div
											key={index}
											className="border-b w-full flex items-center justify-between border-gray-700 px-4">
											<div className="h-[5vh] flex items-center truncate">
												{item}
											</div>
											<div className="flex gap-2">
												<label className="flex items-center gap-1">
													<input
														type="checkbox"
														checked={checkedItems[`sensory-${index}-yes`]}
														onChange={() =>
															toggleCheck('sensory', index, 'yes')
														}
														className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
														required
													/>
													Yes
												</label>
												<label className="flex items-center gap-1">
													<input
														type="checkbox"
														checked={checkedItems[`sensory-${index}-no`]}
														onChange={() => toggleCheck('sensory', index, 'no')}
														className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
														required
													/>
													No
												</label>
											</div>
										</div>
									))}
								</div>
								<div className="w-full lg:w-[70%]">
									<div className="border-b w-full flex items-center justify-center border-gray-700 bg-[#1C1C1D]">
										<div
											className="h-[5vh] font-bold text-gray-300 flex items-center justify-center truncate"
											colSpan="4">
											PERSONALITIES
										</div>
									</div>
									<div className="border-b w-full flex items-center justify-center border-gray-700 bg-[#3E3E3E]">
										<div
											className="h-[5vh] font-bold text-gray-300 flex items-center justify-center truncate"
											colSpan="4">
											Fast Thinkers
										</div>
									</div>
									{[
										'Determined, take charge, maybe inhibited and quiet because they are not the Alpha in the room',
										'Lighten up the room, happy, socially interactive in big group, will ask questions',
									].map((item, index) => (
										<div
											key={index}
											className="border-b w-full flex items-center justify-between border-gray-700 px-2">
											<div className="h-[5vh] flex items-center w-[70%] truncate">
												{item}
											</div>
											<div className="flex gap-2">
												<label className="flex items-center gap-1">
													<input
														type="checkbox"
														checked={
															checkedItems[`personalities-1-${index}-yes`]
														}
														onChange={() =>
															toggleCheck('personalities-1', index, 'yes')
														}
														className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
														required
													/>
													Yes
												</label>
												<label className="flex items-center gap-1">
													<input
														type="checkbox"
														checked={
															checkedItems[`personalities-1-${index}-no`]
														}
														onChange={() =>
															toggleCheck('personalities-1', index, 'no')
														}
														className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
														required
													/>
													No
												</label>
											</div>
										</div>
									))}
									<div className="border-b w-full flex items-center justify-center border-gray-700 bg-[#3E3E3E]">
										<div
											className="h-[5vh] font-bold text-gray-300 flex items-center justify-center truncate"
											colSpan="4">
											Slow Thinkers
										</div>
									</div>
									{[
										'Quiet, socially interactive in person to person, will ask questions quietly during breaks',
										'Systematic, deep thinkers, will ask lots of questions',
									].map((item, index) => (
										<div
											key={index}
											className="border-b w-full flex items-center justify-between border-gray-700 px-2">
											<div className="h-[5vh] flex items-center w-[70%] truncate">
												{item}
											</div>
											<div className="flex gap-2">
												<label className="flex items-center gap-1">
													<input
														type="checkbox"
														checked={
															checkedItems[`personalities-2-${index}-yes`]
														}
														onChange={() =>
															toggleCheck('personalities-2', index, 'yes')
														}
														className="h-4 w-4 text-green-500 bg-gray-700 border-gray-500 rounded"
														required
													/>
													Yes
												</label>
												<label className="flex items-center gap-1">
													<input
														type="checkbox"
														checked={
															checkedItems[`personalities-2-${index}-no`]
														}
														onChange={() =>
															toggleCheck('personalities-2', index, 'no')
														}
														className="h-4 w-4 text-red-500 bg-gray-700 border-gray-500 rounded"
														required
													/>
													No
												</label>
											</div>
										</div>
									))}
								</div>
							</div>
						</tbody>
					</table>
				</div>
			</div>
			<div className="flex items-center w-full justify-center py-4">
				<button
					className="bg-[#1C1C1D] px-12 py-2 rounded-md"
					onClick={handleConfirm}>
					{isLoading ? 'Confirming.....' : 'Confirm'}
				</button>
			</div>
			<div className="flex justify-center items-center gap-3">
				<button
					className="px-4 py-2 flex items-center justify-center gap-3 rounded border border-[#BDC5DB]"
					onClick={handlePrevious}
					disabled={
						!selectedParticipant ||
						participants[0]?.id === selectedParticipant.id
					}>
					<MdArrowBack /> Previous
				</button>
				<button
					className="px-4 py-2 flex items-center justify-center gap-3 rounded border border-[#BDC5DB]"
					onClick={handleNext}
					disabled={
						!selectedParticipant ||
						participants[participants.length - 1]?.id === selectedParticipant.id
					}>
					Next <IoArrowForward />
				</button>
			</div>
		</div>
	);
};

export default Assessmendivetail;
