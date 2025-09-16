/**
 * Login Component
 * 
 * Provides user authentication functionality (Login and Signup) via a form.
 * Handles both registration of new users and login of existing users.
 * Integrates with the backend API and updates global application state upon success.
 * 
 * @component
 * @example
 * return <Login />
 */
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../src/assets/assets";
import AppContext from "../src/context/appContext";
import axios from 'axios';
import { toast } from "react-toastify";

const Login = () => {
  // Navigation hook for routing
  const navigate = useNavigate();

  // Component state management
  const [state, setState] = useState("Sign up"); // Toggles between 'Sign up' and 'Sign in'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Access global state and functions from AppContext
  const { backendUrl, setIsLoggedIn, getUsersData } = useContext(AppContext);

  /**
   * Handles form submission for both login and registration.
   * Sends a POST request to the backend API and processes the response.
   * On success, updates global auth state, fetches user data, and redirects.
   * On failure, displays appropriate error messages via toast notifications.
   * 
   * @param {Event} e - The form submission event
   * @async
   */
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      
      // Configure axios for cookie-based authentication and timeout
      axios.defaults.withCredentials = true; // Automatically attaches cookies
      axios.defaults.timeout = 1000; // Set request timeout (consider increasing for production)
      
      let response;
      
      // Determine which API endpoint to call based on the form state
      if (state === 'Sign up') {
        response = await axios.post(backendUrl + '/auth/api/register', { username, email, password });
      } else if (state === 'Sign in') {
        response = await axios.post(backendUrl + '/auth/api/login', { email, password });
      }
      
      console.log('API RESPONSE :', response.data);

      // Handle successful response
      if (response.data.success) {
        setIsLoggedIn(true);     // Update global authentication state
        getUsersData();          // Fetch user data for the application
        toast.success(response.data.message ); // Show success message
        navigate('/home');       // Redirect to the home page
      }
    } catch (error) {
      // Handle and display errors based on the type of error
      if (error.response) {
        // The request was made and the server responded with an error status
        return toast.error(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        return toast.error(`No response from the server`);
      } 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 text-xl">
      {/* Logo with navigation back to home */}
      <img
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt="Company Logo"
        onClick={() => navigate('/home')}
      />

      {/* Authentication Form Container */}
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm sm:text-xl">
        <h2 className="text-2xl font-semibold text-white text-center">
          {state === "Sign up" ? "Register now" : "Login now"}
        </h2>
        <p className="text-center mb-6 text-sm">
          {state === "Sign up" ? "Create an account" : "Login to your account"}
        </p>

        <form onSubmit={submitHandler}>
          {/* Username Input (only shown during registration) */}
          {state === 'Sign up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C] text-white">
              <img src={assets.person_icon} alt="User icon" />
              <input
                className="bg-transparent outline-none"
                type="text"
                placeholder="Full name"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                title="Please avoid space between letters"
                required
              />
            </div>
          )}

          {/* Email Input */}
          <div className="flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.mail_icon} alt="Email icon" />
            <input
              className="bg-transparent outline-none"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-3 w-full px-6 py-2.5 mt-5 rounded-full bg-[#333A5C] text-white">
            <img src={assets.lock_icon} alt="Password icon" />
            <input
              className="bg-transparent outline-none"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {/* Forgot Password Link */}
          <p
            className="text-indigo-500 px-4 py-2.5 text-sm cursor-pointer"
            onClick={() => navigate('/reset-password')}
          >
            Forgot password?
          </p>

          {/* Submit Button */}
          <button
            className="w-full py-2 bg-gradient-to-br from-blue-500 to-purple-900 rounded-full text-white font-medium cursor-pointer"
            type="submit"
          >
            {state}
          </button>

          {/* Toggle between Login and Signup */}
          {state === 'Sign up' ? (
            <p className="text-center text-xs text mt-2 text-gray-400">
              Already have an account?{' '}
              <span
                className="text-sm text-indigo-500 font-semibold cursor-pointer underline"
                onClick={() => setState('Sign in')}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-center text-xs text-gray-400 mt-2">
              Don't have an account? {' '}
              <span
                className="text-sm font-semibold text-indigo-500 cursor-pointer underline"
                onClick={() => setState('Sign up')}
              >
                Sign up here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;