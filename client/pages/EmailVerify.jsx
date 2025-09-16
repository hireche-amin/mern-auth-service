import React, { useContext, useRef} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { assets } from "../src/assets/assets";
import { toast } from "react-toastify";
import AppContext from "../src/context/appContext";
import axios from "axios";

const EmailVerify = () => {
  const Navigate = useNavigate();
  const inputRef = useRef([]); 
  const {backendUrl} = useContext(AppContext);
  const handleInput =  (e,index) => {
    if(e.target.value.length > 0 && index < inputRef.current.length - 1 ) {
      inputRef.current[index+1].focus()
    }
  }; 
  const handleKeyDow = (e,index) => {
    if(e.key === 'Backspace' && !e.target.value && index > 0 ) {
      inputRef.current[index-1].focus()
    }
  };
  const AccountVerification = async () => {
    try{
      const otp = inputRef.current.map((input) => input.value).join('')

      if(otp.length < 6) {
        return toast.error('Please enter the complete otp ')
      };
      axios.defaults.withCredentials = true ; 
      const response = await axios.post(backendUrl + '/auth/api/email-verification', {otp})
      const result = response.data 
      if(result.success) {
        toast.success(result.message); 
        Navigate('/home')
      }
    }catch(error){
      if(error.response) {
        return toast.error(error.response.data.message)
      }
      else if(error.response?.status === 403 ){
       return toast.error('Invalid or expired token. Please try again ')
      }else if(error.request){
        toast.error('Internal server error')
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
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-70 sm:w-100  text-indigo-300 text-sm sm:text-xl  ">
        <h2 className="text-sm sm:text-2xl font-semibold text-white text-center ">
          Account Verification
        </h2>
        <p className=" text-center  mb-6 text-sm">
          Please enter the OTP sent to your email :
        </p>
        <form className="pb-5 rounded-md">
        <div className="flex justify-center gap-3" > 
          {Array(6).fill(0).map((_,index) => (
            <input type="text" key={index} maxLength='1' required 
              className="w-8 h-8 sm:w-12 sm:h-12 md:w-13 md:h-13 
                   text-white text-lg sm:text-xl bg-[#333A5C] 
                   rounded-md text-center" 
                   ref={(e) =>inputRef.current[index] = e }
                   onInput={(e) => handleInput(e,index)}
                   onKeyDown={(e) =>handleKeyDow(e,index)}
            />
          ))}
        </div>
        </form>
         <button
          className=" w-full text-lg text-center font-bold text-white p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-900 cursor-pointer"
          onClick={AccountVerification}
         >Verify Email</button>
      </div>
    </div>
  );
};

export default EmailVerify;
