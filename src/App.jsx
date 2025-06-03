import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./authentication/Login";
import Home from "./page/Home";
import "./App.css";
import { useAuth } from "./component/AuthContext";
import NotFound from "./page/NotFound";
import ForgetEmail from "./authentication/ForgetEmail";
import OtpVerification from "./authentication/OtpVerification";
import ResetPassword from "./authentication/ResetPassword";
import AdminLogin from "./authentication/AdminLogin";
import CoachList from "./page/CoachList";
import ActivateEmail from "./authentication/ActivateEmail";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<LoginRedirect />} />
				{/* <Route path="/admin_login" element={<AdminLoginRedirect />} /> */}
				<Route path="/forget_password" element={<ForgetEmail />} />
				<Route path="/otp_verification" element={<OtpVerification />} />
				<Route path="/email_activate" element={<ActivateEmail />} />
				<Route path="/reset_password" element={<ResetPassword />} />

				{/* Protected Routes */}
				<Route
					path="/home"
					element={<ProtectedRoute component={<Home />} />}
				/>
				<Route
					path="/coachlist"
					element={<ProtectedRoute component={<CoachList />} />}
				/>

				{/* Catch-all for NotFound */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	);
};

// Redirect to home if user is already authenticated when trying to access login page
const LoginRedirect = () => {
	const { isAuthenticated, auth } = useAuth();
	console.log("AUTH ", auth);
	return isAuthenticated ? <Navigate to="/home" replace /> : <Login />;
};

// const AdminLoginRedirect = () => {
// 	const { isAuthenticated, auth } = useAuth();
// 	console.log("AUTH ", auth);
// 	return isAuthenticated ? <Navigate to="/home" replace /> : <AdminLogin />;
// };

// ProtectedRoute Component
const ProtectedRoute = ({ component }) => {
	const { isAuthenticated } = useAuth();

	// If authenticated, render the protected component, otherwise redirect to login page
	return isAuthenticated ? component : <Navigate to="/" replace />;
};

export default App;
