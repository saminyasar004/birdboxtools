import React, { useState } from 'react';
import Logo from '../assets/logo.svg';
import Black from '../assets/black.png';
import { MdLockOutline } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoCheckCircleFill } from 'react-icons/go';
import { MdArrowBack } from 'react-icons/md';
import axiosInstance from '../component/axiosInstance';

const ResetPassword = () => {
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: '',
	});
	const [passwordSuccessful, setPasswordSuccessful] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem('token'); // Get token from local storage
	// Get email and token from OTP verification

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id === 'password' ? 'password' : 'confirmPassword']: value,
		}));
		setError('');
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validation
		if (!formData.password || !formData.confirmPassword) {
			setError('Please fill in all fields');
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return;
		}
		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters long');
			return;
		}
		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post(
				'/accounts/reset-password/',
				{
					new_password: formData.password,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`, // Include token in header
					},
				}
			);

			console.log('Password reset successful:', response.data);
			localStorage.removeItem('token'); // Remove token after successful password reset
			setPasswordSuccessful(true);
			setTimeout(() => navigate('/'), 2000);
		} catch (err) {
			setError(
				err.response?.data?.detail ||
					'Failed to reset password. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-between min-h-screen bg-primary md:px-10 px-3">
			<div className="w-1/2 h-[90vh] hidden md:block">
				<img src={Black} alt="" className="w-full h-full bg-cover rounded-md" />
			</div>
			<div className="md:w-1/2 w-full flex items-center justify-center">
				<div className="md:w-[60%] w-full md:p-8 space-y-8 rounded-lg">
					<div className="flex justify-center">
						<img src={Logo} alt="Birdbox Logo" className="w-32 h-32" />
					</div>
					{passwordSuccessful ? (
						<div className="space-y-4 bg-[#19191A] rounded-md box-shadow flex flex-col items-center justify-center p-10">
							<GoCheckCircleFill size={30} color="#1E5DCC" />
							<p className="text-[20px] text-t_color">
								Password changed successfully
							</p>
							<Link
								to={'/login'}
								className="px-3 flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-700 rounded text-white text-sm font-bold">
								<MdArrowBack size={20} />
								Back To Login
							</Link>
						</div>
					) : (
						<form
							onSubmit={handleSubmit}
							className="space-y-6 bg-[#19191A] border-[#3831A3] rounded-md box-shadow border p-10">
							{error && (
								<p className="text-red-500 text-center text-sm">{error}</p>
							)}
							<div className="flex flex-col gap-1">
								<label htmlFor="password" className="text-[#BDC5DB] block">
									Password
								</label>
								<div className="relative">
									<MdLockOutline className="absolute left-3 top-3 text-[#BDC5DB] text-lg" />
									<input
										type="password"
										id="password"
										value={formData.password}
										onChange={handleChange}
										placeholder="Password"
										className="pl-10 w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
										required
									/>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<label
									htmlFor="confirmPassword"
									className="text-[#BDC5DB] block">
									Confirm Password
								</label>
								<div className="relative">
									<MdLockOutline className="absolute left-3 top-3 text-[#BDC5DB] text-lg" />
									<input
										type="password"
										id="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleChange}
										placeholder="Confirm Password"
										className="pl-10 w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
										required
									/>
								</div>
							</div>
							<div className="w-full flex items-center justify-center">
								<button
									type="submit"
									disabled={loading}
									className={`md:w-[30%] flex items-center justify-center py-3 px-4 bg-blue-500 rounded text-white text-sm font-bold ${
										loading
											? 'opacity-50 cursor-not-allowed'
											: 'hover:bg-blue-700'
									}`}>
									{loading ? 'Resetting...' : 'Confirm'}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
