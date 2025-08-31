import React from "react";
import { assets } from "../assets/assets";
const  Header = () => {
    return <div className="flex flex-col items-center p-20 px-4 text-center text-gray-800 ">
        <img src={assets.header_img} alt="header-image" className="w-36 h-36 rounded-full mb-6"/>
        <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">Hey Developer <img src={assets.hand_wave} className=" w-8 aspect-square"/></h1>
        <h2 className="text-3xl sm:text-5xl font-semibold mb-4">Welcome! We're glad to have you on on our app</h2>
        <p className="mb-8 max-w-md">Dream it, code it </p>
        <button className=" border-gray-800 border-solid border-1 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer" >Register now</button>
    </div>
}; 
export default Header