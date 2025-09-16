/**
 * AppContextProvider Component
 * 
 * Provides global state and functions to the application via React Context.
 * This includes authentication status, user data, and backend configuration.
 * Must be used at the top level of the component tree to wrap the entire app.
 */
import axios from "axios";
import AppContext from "./appContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * The main context provider component that manages global application state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider
 */
export const AppContextProvider = (props) => {
    // Backend API base URL loaded from environment variables
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    
    // State tracking user authentication status
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    
    // State storing current user data (null when not logged in)
    const [userData, setUserData] = useState(null); 
    
    /**
     * Fetches user data from the backend API and updates state
     * @async
     */
    const getUsersData = async () => {
        try{
           const response =  await axios.get(backendUrl + '/api/users'); 
         if(response.data.success){
            setUserData(response.data.userData)
         }else if(response.error) {
            toast.error(response.data.message || 'Failed to fetch user data')
         }
        }catch(error){
        toast.error(error.response.data.message)
        }
    };
    
    /**
     * Checks and validates the user's authentication state with the backend
     * @async
     */
    const getUserAuthState = async () => {
        try{
            const response = await axios.get(backendUrl + '/api/users'); 
            const result = response.data
            if(result.success) {
                setIsLoggedIn(true)
                setUserData(result.userData)
            }else if(result.error) {
                toast.error(result.message || 'User not Found')
            }

        }catch(error){
            if(error.result){
                toast.error(error.result.message || 'Internal server error')
            }
        }
    };

    // Effect to check authentication state when component mounts
    useEffect(() => {
        getUserAuthState
    });

    // Value object containing all state and functions to be provided via context
    const value = {
        backendUrl, 
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUsersData,
        getUserAuthState,
    }
    
    // Provides the context value to all child components
    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}