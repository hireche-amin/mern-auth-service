import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
const Navbar = () => {
    const navigate = useNavigate(); 
    return <div className="w-full flex justify-between items-center p-4 sm:p-6  absolute top-0">
        <img src={assets.logo} alt="Logo" className='w-28 sm:w-32'/>
        <button onClick={() => navigate('/login')} className="flex items-center gap-2  border-gray-500 border-solid border-1 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer "  >Login<img src={assets.arrow_icon}/></button> 
    </div>
}; 
export default Navbar;