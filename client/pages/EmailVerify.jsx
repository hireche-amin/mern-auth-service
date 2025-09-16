import React, { useContext, useRef} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { assets } from "../src/assets/assets";
import { toast } from "react-toastify";
import AppContext from "../src/context/appContext";
import axios from "axios";

/**
 * EmailVerify Component
 * 
 * This component provides the user interface and logic for verifying a user's email address
 * using a One-Time Password (OTP). The OTP is entered through six individual input fields.
 * The user is redirected to the home page upon successful verification.
 * 
 * Features:
 * - OTP entry through multiple input fields.
 * - Auto-focus movement to the next input upon typing.
 * - Backspace functionality to move to the previous input.
 * - Submits OTP to the backend for verification.
 * - Displays success/error notifications using react-toastify.
 */
const EmailVerify = () => {
  /** 
   * React Router's navigation hook.
   * Used for redirecting users after successful verification or when clicking the logo. 
   */
  const Navigate = useNavigate();

  /**
   * Reference for OTP input fields.
   * An array of refs is used to handle focus control across multiple input elements.
   */
  const inputRef = useRef([]); 

  /**
   * Access to global context values, specifically `backendUrl`.
   * `backendUrl` is used as the API base for email verification requests.
   */
  const { backendUrl } = useContext(AppContext);

  /**
   * Handles user input in OTP fields.
   * - Automatically shifts focus to the next input if the current input has a value.
   * 
   * @param {Object} e - Input event.
   * @param {number} index - The index of the current OTP input field.
   */
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  }; 

  /**
   * Handles key down events in OTP fields.
   * - Moves focus to the previous input when the "Backspace" key is pressed and the field is empty.
   * 
   * @param {Object} e - Keyboard event.
   * @param {number} index - The index of the current OTP input field.
   */
  const handleKeyDow = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  /**
   * Handles the OTP verification process.
   * - Collects OTP values from input fields.
   * - Validates OTP length before submitting.
   * - Sends OTP to the backend via Axios POST request.
   * - Handles responses:
   *    - Success → displays success toast & navigates to `/home`.
   *    - Error → displays appropriate error toast.
   */
  const AccountVerification = async () => {
    try {
      const otp = inputRef.current.map((input) => input.value).join('');

      if (otp.length < 6) {
        return toast.error('Please enter the complete otp ');
      }

      axios.defaults.withCredentials = true; 
      const response = await axios.post(
        backendUrl + '/auth/api/email-verification',
        { otp }
      );

      const result = response.data;

      if (result.success) {
        toast.success(result.message); 
        Navigate('/home');
      }
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.message);
      }
      else if (error.response?.status === 403) {
        return toast.error('Invalid or expired token. Please try again ');
      } else if (error.request) {
        toast.error('Internal server error');
      }
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 text-xl  ">
      {/* Logo for navigation */}
      <img
        className="absolute left-5 sm:left-20 top-5  w-28 sm:w-32 cursor-pointer "
        src={assets.logo}
        alt="Login page logo"
        onClick={() => Navigate("/home")}
      ></img>

      {/* Verification card */}
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-70 sm:w-100  text-indigo-300 text-sm sm:text-xl  ">
        <h2 className="text-sm sm:text-2xl font-semibold text-white text-center ">
          Account Verification
        </h2>
        <p className=" text-center  mb-6 text-sm">
          Please enter the OTP sent to your email :
        </p>

        {/* OTP Input fields */}
        <form className="pb-5 rounded-md">
          <div className="flex justify-center gap-3"> 
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                key={index}
                maxLength="1"
                required 
                className="w-8 h-8 sm:w-12 sm:h-12 md:w-13 md:h-13 
                       text-white text-lg sm:text-xl bg-[#333A5C] 
                       rounded-md text-center" 
                ref={(e) => inputRef.current[index] = e }
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDow(e, index)}
              />
            ))}
          </div>
        </form>

        {/* Verify Button */}
        <button
          className=" w-full text-lg text-center font-bold text-white p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-900 cursor-pointer"
          onClick={AccountVerification}
        >
          Verify Email
        </button>
      </div>
    </div>
  );
};

export default EmailVerify;
