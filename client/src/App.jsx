import React from "react";
import {Route,Routes} from 'react-router-dom'; 
import Home from "../pages/Home";
import Login from "../pages/Login";
import EmailVerify from "../pages/EmailVerify";
import ResetPassword from "../pages/ResetPassword";
 import { ToastContainer } from 'react-toastify';
export default function App () {
  return <>
  <ToastContainer/>
  <Routes>
    <Route path='/home' element = {<Home/>} />
    <Route path='/login' element = {<Login/>} />
    <Route path='/email-verify' element = {<EmailVerify/>} />
    <Route path='/reset-password' element = {<ResetPassword/>} />
  </Routes>
  </>
}; 
  