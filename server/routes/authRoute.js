const express = require('express'); 
const {userRegisterController,userLoginController,logOutController} = require('../controllers/authController'); 
const router = express.Router(); 
router.post('/register',userRegisterController); 
router.post('/login',userLoginController); 
router.post('/logout',logOutController); 
module.exports=router; 