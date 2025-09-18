/**
 * Header Component
 * 
 * Displays a welcome message and user information in the application header.
 * Greets the user by name if available, otherwise uses a default greeting.
 * Features a promotional section with a call-to-action button.
 * 
 * @component
 * @example
 * return (
 *   <Header />
 * )
 */
import React from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import AppContext from "../context/appContext";
import { toast } from "react-toastify";

/**
 * Header component that displays user information and welcome content
 * @returns {React.Element} The header section with user greeting and welcome message
 */
const Header = () => {
    // Access user data from application context
    const { userData } = useContext(AppContext);
    function handleClick () {
        toast('🚧 This feature  still in development. Please check back later!')
    }
    
    return (
        <div className="flex flex-col items-center p-20 px-4 text-center text-gray-800 ">
            {/* User avatar/image */}
            <img 
                src={assets.header_img} 
                alt="Header section decorative element" 
                className="w-36 h-36 rounded-full mb-6"
            />
            
            {/* Personalized greeting with user's name */}
            <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
                Hey {userData ? userData.name : 'Developer'}
                <img 
                    src={assets.hand_wave} 
                    alt="Waving hand icon" 
                    className="w-8 aspect-square"
                />
            </h1>
            
            {/* Console log for debugging user data (development only) */}
            {console.log(userData)}
            
            {/* Main welcome message */}
            <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
                Welcome! We're glad to have you on our app
            </h2>
            
            {/* Inspirational tagline */}
            <p className="mb-8 max-w-md">Dream it, code it</p>
            
            {/* Disabled call-to-action button with tooltip */}
            <button 
                className="border-gray-800 border-solid border-1 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                onClick={handleClick}
            >
                Get started
            </button>
        </div>
    )
}; 

export default Header;