const express = require('express'); 
const {userRegisterController,userLoginController,logOutController,sendOtpController,otpVerificationController} = require('../controllers/authController');
const {authMiddleware} = require('../middlewares/userAuth')
const router = express.Router(); 
router.post('/register',userRegisterController); 
router.post('/login',userLoginController); 
router.post('/logout',logOutController); 
router.post('/send-otp',authMiddleware, sendOtpController); 
router.post('/email-verification',authMiddleware,otpVerificationController)
module.exports=router; 