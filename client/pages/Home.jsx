/**
 * Home Component
 * 
 * Serves as the main landing page for the application. Provides a container
 * layout with background styling and renders the main navigation and header
 * components.
 * 
 * 
 * @component
 * @example
 * return <Home />
 */
import React from "react";
import Navbar from "../src/components/Navbar";
import Header from "../src/components/Header";

/**
 * Home page component that serves as the main application dashboard
 * @returns {React.Element} The home page layout with navigation and header sections
 */
const Home = () => {
    return (
        <div className="bg-[url(/C:\Users\amin\Desktop\mern-auth\client\src\assets\bg_img.png)] bg-cover bg-center">
            <Navbar/>
            <Header/>
        </div>
    )
};

export default Home;