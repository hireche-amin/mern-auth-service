import React, { useContext, useState } from "react";
import { assets } from "../src/assets/assets";
import { useNavigate } from "react-router-dom";
import AppContext from "../src/context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useRef } from "react";

/**
 * ResetPassword Component
 *
 * This component handles the complete password reset flow:
 * 1. User submits their email to request an OTP.
 * 2. User enters the OTP received via email.
 * 3. User sets a new password.
 *
 * The component uses conditional rendering to switch between
 * - Email submission form
 * - OTP entry form
 * - New password form
 *
 * API requests are sent to the backend for OTP generation and password reset.
 * Notifications are shown using react-toastify.
 */
const ResetPassword = () => {
  /** Navigation hook from react-router */
  const Navigate = useNavigate();

  /** Stores references to OTP input fields for focus management */
  const inputRef = useRef([]);

  /** Access backend URL from AppContext */
  const { backendUrl } = useContext(AppContext);

  /** Tracks whether the email has been submitted successfully */
  const [isEmailSent, setIsEmailSent] = useState('');

  /** Stores user's email input */
  const [email, setEmail] = useState('');

  /** Tracks whether the OTP has been entered */
  const [isOtpSent, setIsOtpSent] = useState(false);

  /** Stores OTP entered by the user */
  const [otp, setOtp] = useState(0);

  /** Stores new password entered by the user */
  const [newPassword, setNewpassword] = useState('');

  axios.defaults.withCredentials = true;

  /**
   * Handles OTP input typing.
   * Automatically shifts focus to the next field if a value is entered.
   *
   * @param {Object} e - Input event
   * @param {number} index - Index of the current OTP input field
   */
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  };

  /**
   * Handles backspace behavior in OTP fields.
   * Moves focus back to the previous input if the current field is empty.
   *
   * @param {Object} e - Keyboard event
   * @param {number} index - Index of the current OTP input field
   */
  const handleKeyDow = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  /**
   * Handles email submission to request OTP.
   * Sends a request to the backend with the user's email.
   *
   * @param {Object} e - Form submit event
   */
  const emailSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/auth/api/reset-otp", {
        email,
      });

      if (response.data.success) {
        setIsEmailSent(true);
        toast.success(
          response.data.message || "OTP sent to your email. Please check it"
        );
      }
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from the server");
        console.log(error.request);
      }
    }
  };

  /**
   * Handles OTP submission by the user.
   * Joins all OTP input values into a single string.
   *
   * @param {Object} e - Form submit event
   */
  const otpSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const addOtp = inputRef.current.map((input) => input.value).join("");
      setOtp(addOtp);
      setIsOtpSent(true);
    } catch (error) {
      console.error("An error has occurred in the otp submit handler", error);
    }
  };

  /**
   * Handles new password submission.
   * Sends the email, OTP, and new password to the backend for reset.
   *
   * @param {Object} e - Form submit event
   */
  const newPasswordHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        backendUrl + "/auth/api/password-reset",
        { email, otp, newPassword }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Password reset successfully");
        Navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No response from the server");
      }
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 text-xl  ">
      <img
        className="absolute left-5 sm:left-20 top-5  w-28 sm:w-32 cursor-pointer "
        src={assets.logo}
        alt="Login page logo"
        onClick={() => Navigate("/home")}
      ></img>

      {/* Email input form */}
      {!isEmailSent && (
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-72 sm:w-96  text-indigo-300 text-xs sm:text-sm  ">
          <h2 className="text-sm sm:text-2xl font-semibold text-white text-center ">
            Reset password
          </h2>
          <p className=" text-center  mb-6 text-xs sm:text-xl">
            Please enter your email address :
          </p>
          <form className="pb-5 rounded-md" onSubmit={emailSubmitHandler}>
            <div className="flex items-center gap-3 w-full  px-6 py-2.5 rounded-full bg-[#333A5C] text-white">
              <img src={assets.mail_icon} alt="Email icon" />
              <input
                className="bg-transparent outline-none "
                type="email"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <button
              className=" w-full text-sm sm:text-lg text-center font-bold text-white p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-900 cursor-pointer mt-5"
              type="submit"
            >
              Send OTP
            </button>
          </form>
        </div>
      )}

      {/* OTP verification form */}
      {isEmailSent && !isOtpSent && (
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-72 sm:w-96  text-indigo-300 text-sm sm:text-sm  ">
          <h2 className="text-sm sm:text-2xl font-semibold text-white text-center ">
            Reset password
          </h2>
          <p className=" text-center  mb-6 text-sm">
            Please enter the OTP sent to your email :
          </p>
          <form className="pb-5 rounded-md">
            <div className="flex justify-center gap-3">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    key={index}
                    maxLength="1"
                    required
                    className="w-8 h-8 sm:w-12 sm:h-12 md:w-13 md:h-13 
                       text-white text-lg sm:text-xl bg-[#333A5C] 
                       rounded-md text-center"
                    ref={(e) => (inputRef.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDow(e, index)}
                  />
                ))}
            </div>
          </form>
          <button
            className=" w-full text-lg text-center font-bold text-white p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-900 cursor-pointer"
            onClick={otpSubmitHandler}
            type="submit"
          >
            submit
          </button>
        </div>
      )}

      {/* New password form */}
      {isEmailSent && isOtpSent && (
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-72 sm:w-96  text-indigo-300 text-sm sm:text-sm  ">
          <h2 className="text-sm sm:text-2xl font-semibold text-white text-center ">
            Reset password
          </h2>
          <p className=" text-center  mb-6 text-xs sm:text-xl">
            Please enter new password :
          </p>
          <form className="pb-5 rounded-md" onSubmit={newPasswordHandler}>
            <div className="flex items-center gap-3 w-full px-6 py-2.5 rounded-full bg-[#333A5C] text-white">
              <img src={assets.lock_icon} alt="Email icon" />
              <input
                className="bg-transparent outline-none"
                type="password"
                placeholder="password"
                onChange={(e) => setNewpassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>
            <button
              className=" w-full text-sm sm:text-lg text-center font-bold text-white p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-900 cursor-pointer mt-5"
              type="submit"
            >
              Reset password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
