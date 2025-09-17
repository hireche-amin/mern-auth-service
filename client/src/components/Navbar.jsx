/**
 * Navbar Component
 * 
 * Provides the main navigation header for the application with conditional rendering
 * based on user authentication state. Displays either user profile dropdown menu
 * (when authenticated) or login button (when not authenticated).
 * 
 * Features responsive dropdown behavior with hover interactions for desktop
 * and click interactions for mobile devices, including outside-click detection
 * for proper menu dismissal.
 * 
 * @component
 * @requires react
 * @requires react-router-dom
 * @requires context/appContext
 * @requires lucide-react
 * @requires axios
 * @requires react-toastify
 * 
 */
import React, { useContext, useState, useRef, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import AppContext from "../context/appContext";
import { LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, userData, setUserData, setIsLoggedIn } =
    useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref for the dropdown menu

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside); // For mobile touch
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]); // Re-run when isMenuOpen changes

  /**
   * Handles user logout functionality by making API call to backend logout endpoint
   * Updates global authentication state, shows toast notification, and navigates to home
   * @async
   * @function logoutFunc
   * @returns {Promise<void>}
   */
  const logoutFunc = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendUrl + "/auth/api/logout");
      const result = response.data;
      if (result.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success("You have been logged out!");
        navigate("/home");
        setIsMenuOpen(false);
      }
      console.log(result.success);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
      console.error("Error with the logout function", error);
    }
  };

  /**
   * Initiates email verification process by sending OTP to user's registered email
   * Navigates to email verification page upon successful OTP generation
   * @async
   * @function emailVerify
   * @returns {Promise<void>}
   */
  const emailVerify = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendUrl + "/auth/api/send-otp");
      const result = response.data;
      if (result.success) {
        toast.success(result.message);
        navigate("/email-verify");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  /**
   * Toggles the visibility state of the user dropdown menu
   * Primarily used for mobile devices where hover interactions are not available
   * @function toggleMenu
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 absolute top-0">
      <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
      {userData ? (
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black text-white relative group">
          <div 
            onClick={toggleMenu}
            className="w-full h-full flex items-center justify-center cursor-pointer"
          >
            {userData.name[0].toUpperCase()}
          </div>
          
          {/* Dropdown menu with ref attached */}
          <div
            ref={menuRef} // Attach the ref here
            className={`absolute top-0 right-0 z-10 rounded-full pt-10 text-black w-35 
              ${isMenuOpen ? 'block' : 'hidden'} 
              group-hover:block`}
          >
            <ul className="list-none m-0 p-2 bg-gray-200 text-sm text-center rounded-lg mt-2">
              {!userData.isAccountVerified && (
                <li
                  onClick={emailVerify}
                  className="py-1 px-2 bg-gray-100 rounded-full mb-2 cursor-pointer hover:bg-gray-300"
                >
                  Verify email
                </li>
              )}
              <div className="flex items-center justify-center py-1 px-2 bg-gray-100 rounded-full cursor-pointer hover:text-red-400">
                <li onClick={logoutFunc} className="pr-1">
                  Logout{" "}
                </li>
                <LogOut width={14} height={14} />
              </div>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border-gray-500 border-solid border-1 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow icon" />
        </button>
      )}
    </div>
  );
};

export default Navbar;