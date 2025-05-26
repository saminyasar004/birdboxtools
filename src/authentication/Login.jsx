import React, { useState } from 'react';
import { MdEmail, MdLockOutline } from 'react-icons/md';
import Logo from '../assets/logo.svg';
import Black from '../assets/black.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../component/AuthContext';
import axiosInstance from '../component/axiosInstance';

const Login = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth(); // Assuming you have a useAuth hook for authentication

	// Handle input changes
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Basic validation
		if (!formData.email || !formData.password) {
			setError('Please fill in all fields');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/accounts/login/', {
				email: formData.email,
				password: formData.password,
			});

			// Assuming the API returns a token and role

			// Redirect based on role or to home page
			if (response.status === 200) {
				login(
					formData.email,
					response.data.access_token,
					response.data.refresh_token
				);
				localStorage.setItem('role', 'coach');
				navigate('/home'); // Redirect to home page on success
			}
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Login failed. Please check your credentials.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex md:flex-row flex-col items-center justify-between min-h-screen bg-gray-900 px-10 md:py-0 py-10">
			<div className="md:w-1/2 md:h-[90vh] hidden md:block">
				<img
					src={Black}
					alt=""
					className="w-full h-full rounded-md object-cover"
				/>
			</div>
			<div className="md:w-1/2 w-full flex items-center justify-center">
				<div className="md:w-[50%]  md:p-8 space-y-8 rounded-lg">
					<div className="flex justify-center">
						<img src={Logo} alt="Birdbox Logo" className="w-24 h-24" />
					</div>
					<div className="flex justify-center">
						<span className="text-[#BDC5DB] text-3xl font-bold">
							Welcome Back to birdbox
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
									value={formData.email}
									onChange={handleChange}
									placeholder="user@mail.com"
									className="pl-10 w-full px-3 py-2 leading-tight text-gray-50 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>
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
									className="pl-10 w-full px-3 py-2 leading-tight text-gray-50 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>
						<div className="flex items-end justify-end">
							<Link to="/forget_password" className="text-blue-400 text-[14px]">
								Forget Password
							</Link>
						</div>
						<button
							type="submit"
							disabled={loading}
							className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded focus:outline-none focus:shadow-outline ${
								loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
							}`}>
							{loading ? 'Logging in...' : 'Login'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
