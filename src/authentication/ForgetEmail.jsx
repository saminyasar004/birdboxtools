import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import Logo from '../assets/logo.svg';
import Black from '../assets/black.png';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../component/axiosInstance';
import OtpVerification from './OtpVerification';
import ResetPassword from './ResetPassword';

const ForgetEmail = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [otpVisible, setOtpVisible] = useState(false);
	const [resetPasswordVisble, setResetPasswordVisible] = useState(false);
	const [forgetEmailVisible, setForgetEmailVisible] = useState(true);
	const navigate = useNavigate();

	// Handle input change
	const handleChange = (e) => {
		setEmail(e.target.value);
		setError(''); // Clear error when user types
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!email) {
			setError('Please enter your email');
			return;
		}
		if (!/^\S+@\S+\.\S+$/.test(email)) {
			setError('Please enter a valid email address');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post(
				'/accounts/password-reset-request/',
				{
					email: email,
				}
			);

			// On success, navigate to OTP verification
			console.log('Reset request successful:', response.data);
			setOtpVisible(true);
			setForgetEmailVisible(false);
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Failed to send reset request. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{forgetEmailVisible && (
				<div className="flex items-center justify-between min-h-screen bg-primary md:px-10 px-5">
					<div className="w-1/2 h-[90vh] hidden md:block">
						<img
							src={Black}
							alt=""
							className="w-full h-full bg-cover rounded-md"
						/>
					</div>
					<div className="md:w-1/2 w-full flex items-center justify-center">
						<div className="md:w-[50%] w-full md:p-8 space-y-8 rounded-lg">
							<div className="flex justify-center">
								<img src={Logo} alt="Birdbox Logo" className="w-24 h-24" />
							</div>
							<div className="flex justify-center">
								<span className="text-[#BDC5DB] text-3xl font-bold">
									Confirm email
								</span>
							</div>

							{error && (
								<div className="text-red-500 text-center text-sm">{error}</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="flex flex-col gap-1">
									<label htmlFor="email" className="text-[#BDC5DB] block">
										Email
									</label>
									<div className="relative">
										<MdEmail className="absolute left-3 top-3 text-[#BDC5DB] text-lg" />
										<input
											type="email"
											id="email"
											value={email}
											onChange={handleChange}
											placeholder="user@mail.com"
											className="pl-10 w-full px-3 py-2 leading-tight text-gray-700 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
											required
										/>
									</div>
								</div>

								<div className="flex items-center justify-center w-full py-5">
									<button
										type="submit"
										disabled={loading}
										className={`w-[40%] flex items-center justify-center px-4 py-2 font-bold text-white bg-blue-500 rounded focus:outline-none focus:shadow-outline ${
											loading
												? 'opacity-50 cursor-not-allowed'
												: 'hover:bg-blue-700'
										}`}>
										{loading ? 'Sending...' : 'Send'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
			{otpVisible && (
				<OtpVerification
					email={email}
					setResetPasswordVisible={setResetPasswordVisible}
					setOtpVisible={setOtpVisible}
				/>
			)}
			{resetPasswordVisble && <ResetPassword />}
		</>
	);
};

export default ForgetEmail;
