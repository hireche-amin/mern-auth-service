import axios from "axios";
import AppContext from "./appContext";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export const  AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL; 
    const [isLoggedIn,setIsLoggedIn] = useState(false); 
    const [userData,setUserData] = useState(null); 
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

    useEffect(() => {
        getUserAuthState
    });

    const value = {
        backendUrl, 
        isLoggedIn,setIsLoggedIn,userData,setUserData,getUsersData,getUserAuthState
    }
   return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>

}