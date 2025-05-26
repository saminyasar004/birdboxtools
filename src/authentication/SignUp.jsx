import React, { useState } from 'react';
import Logo from '../assets/logo.svg';
import Black from '../assets/black.png';
import { MdEmail, MdLockOutline } from 'react-icons/md';
import axiosInstance from '../component/axiosInstance';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const SignUp = () => {
	// State to manage form data
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		password: '',
		confirm_password: '',
	});
	const navigate = useNavigate();
	// State for error and success messages
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

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
		if (!formData.name.trim()) {
			setError('Name is required');
			return;
		}
		if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			setError('Invalid email format');
			return;
		}

		if (formData.password.length < 8) {
			setError('Password must be at least 8 characters');
			return;
		}
		if (formData.password !== formData.confirm_password) {
			setError('Passwords do not match');
			return;
		}

		setLoading(true);
		setError('');

		try {
			const response = await axiosInstance.post('/accounts/signup/', formData);

			// Handle successful signup
			console.log('Signup successful:', response.data);

			if (response.status === 201) {
				navigate('/email-activate', { state: { email: formData.email } });
			}
			// You might want to redirect the user or show a success message
			// For example: window.location.href = '/login';
		} catch (err) {
			// Handle error
			setError(
				err.response?.data?.message || 'Signup failed. Please try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-between min-h-screen bg-primary px-10">
			<div className="w-1/2 h-[90vh]">
				<img
					src={Black}
					alt=""
					className="w-full h-full rounded-md object-cover"
				/>
			</div>
			<div className="w-1/2 flex items-center justify-center">
				<div className="w-[50%] p-8 space-y-8 rounded-lg">
					<div className="flex justify-center">
						<img src={Logo} alt="Birdbox Logo" className="w-24 h-24" />
					</div>
					<div className="flex justify-center">
						<span className="text-[#BDC5DB] text-3xl font-bold">
							Welcome to birdbox
						</span>
					</div>

					{error && <div className="text-red-500 text-center">{error}</div>}

					<form className="space-y-6" onSubmit={handleSubmit}>
						<div className="flex flex-col gap-1">
							<label htmlFor="name" className="text-[#BDC5DB] block">
								Name
							</label>
							<div className="relative">
								<input
									type="text"
									id="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="John Doe"
									className="w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>

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
									className="pl-10 w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label htmlFor="phone" className="text-[#BDC5DB] block">
								Phone
							</label>
							<div className="relative">
								<input
									type="tel"
									id="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="123-456-7890"
									className="w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
									className="pl-10 w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label
								htmlFor="confirm_password"
								className="text-[#BDC5DB] block">
								Confirm Password
							</label>
							<div className="relative">
								<MdLockOutline className="absolute left-3 top-3 text-[#BDC5DB] text-lg" />
								<input
									type="password"
									id="confirm_password"
									value={formData.confirm_password}
									onChange={handleChange}
									placeholder="Confirm Password"
									className="pl-10 w-full px-3 py-2 leading-tight text-gray-100 bg-[#121212] border-[#CDD3E4] border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									required
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline ${
								loading ? 'opacity-50 cursor-not-allowed' : ''
							}`}>
							{loading ? 'Registering...' : 'Register'}
						</button>
					</form>

					<div className="text-center flex items-center gap-4 justify-center">
						<p className="text-[#BDC5DB]">Already have an account?</p>
						<Link
							to="/"
							className="inline-block text-sm font-semibold text-blue-500 hover:text-blue-800">
							Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
