const User = require("../models/userModel");
const Jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const transporter = require("../utils/nodeMailer");
const {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE} = require('../utils/emailTemplates'); 
/**
 * Registers a new user by validating input, hashing password, saving to DB,
 * generating a JWT, setting cookie, and sending a welcome email.
 * @async
 * @function userRegisterController
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const userRegisterController = async (req, res) => {
  try {
    //Extract user's informations.
    const { username, email, password } = req.body;
    //Check if the user filled all fields.
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }; 
    //Check if the  user is allready registered
    const checkIfUserExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkIfUserExists) {
      res.status(409).json({
        success: false,
        message: "User allready exists. Please login or use a different email or name.",
      });
    }
    //Hash the user password(saving it inour db)
    const salt = await Bcrypt.genSalt(10);
    const hashedPassword = await Bcrypt.hash(password, salt);
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    //Generate a token
    const token = Jwt.sign(
      {
        user_id: newlyCreatedUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    //send the token .
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "strict" : "none",
      expiresIn: "1d",
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Amin's academy for software development",
      text: `Welcome to amin's academy website. Your account has been created with email id ${email}  `,
    };
    await transporter.sendMail(mailOption);
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
    
  } catch (error) {
    console.error("Error in userRegestrationController", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later",
    });
  }
};
/**
 * Logs in a user by validating credentials, generating a JWT,
 * and setting it in cookies.
 * @async
 * @function userLoginController
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    //Check user's email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
     return res.status(403).json({
        succes: false,
        message: "Invalide email or password",
      });
    };
    //Check user's password
    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalide email or password",
      });
    };

    //Generate a token
    const token = Jwt.sign(
      {
        user_id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    //cookie-config
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "strict" : "none",
      expiresIn: "1d",
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in userLoginController", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later",
    });
  }
};
/**
 * Sends an OTP to the user’s registered email for account verification.
 * @async
 * @function sendOtpController
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const sendOtpController = async(req,res) => {
  try{
  const {user_id} = req.user
    const user = await User.findById(user_id); 
    if(user.isAccountVerified) {
      return res.status(400).json({
        succes: false, 
        message : 'Account already verified '
      }); 
    }; 
     //Generate otp 
    const otp = Math.floor(100000 + Math.random () * 900000) ; 
     user.verifyOtp = otp ; 
     user.otpExpireAt = Date.now() + 10*60*1000
     await user.save(); 
     const email = user.email
     const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP ",
      html:EMAIL_VERIFY_TEMPLATE.replaceAll(`{{otp}}`,otp).replaceAll(`{{email}}`,email)
    };
    await transporter.sendMail(mailOption);
    return res.status(201).json({
      success: true,
      message: " OTP verification  sent on your email . Please verify your account.",
    });


  }catch(error) {
    console.error('Error in OTP send controller', error); 
    return res.status(500).json({
      success: false, 
      message: "An Internal server error. Please try again later"
    })
  }
};
/**
 * Verifies the OTP sent to the user’s email and marks account as verified.
 * @async
 * @function otpVerificationController
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const otpVerificationController = async(req,res) => {
  try{
    const {user_id} = req.user;
    const {otp} = req.body; 
    if(!otp) {
       return res.status(400).json({
        succes: false, 
        message : "Missing details."
      })
    }; 
    const user = await User.findById(user_id); 
    if(user.isAccountVerified == true) {
      return res.status(400).json({
        success : false, 
        message : "Your account is already verified"
      })
    };
    if(!user) {
      return res.status(404).json({
        success : false, 
        message : "User not found"
      })
    }; 
    if(user.verifyOtp === '' || user.verifyOtp  !== otp) {
       return res.status(401).json({
        succes : false, 
        message : 'OTP is not valide. Please try again later.'
      });
    }; 
    if(user.otpExpireAt < Date.now()) {
       return res.status(401).json({
        success : false, 
        message : 'OTP expired. Please try again later.'

      })
    }; 
    user.isAccountVerified = true ; 
    user.verifyOtp = ''; 
    user.otpExpireAt = 0 ; 
    await user.save(); 
    return res.status(200).json({
      success : true, 
      message : 'Account verified successfully'
    });

  }catch(error){
    console.error('Error in email verification controller', error); 
    return res.status(500).json({
      succes: true, 
      message : "An internal server error. Please try again later"
    })
  }
};
/**
 * Sends an OTP for password reset to the user’s email if account exists.
 * @async
 * @function requestOtpForPasswordReset
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const requestOtpForPasswordReset = async (req,res) => {
  try{
    const {email} = req.body; 
    if(!email){
      return res.status(400).json({
        success : false, 
        message : "Please fill in the email field"
      })
    };
    //Check if the email exists
    const user = await User.findOne({email}); 
    if(!user) {
      return res.status(400).json({
        success : false, 
        message : "User not found "
      })
    }; 
    //Generate an otp 
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const salt = await Bcrypt.genSalt(10)
    const hashedOtp = await Bcrypt.hash(otp,salt); 
    user.resetOtp = {
      code : hashedOtp, 
      expireAt : Date.now() + 10 * 60 * 1000, 
      otpAttempts : 0
    }; 
    await user.save();
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password reset OTP ",
      html : PASSWORD_RESET_TEMPLATE.replaceAll(`{{otp}}`,otp).replaceAll(`{{email}}`,email)
    };
    await transporter.sendMail(mailOption);
    return res.status(200).json({
      success: true, 
      message : "OTP sent to your email. Please check it"
    })


  }catch(error) {
    console.error('Error from OTP reset controller', error); 
    res.status(500).json({
      success: false, 
      message : "An internal server error has occured"
    })
  };
}; 
/**
 * Resets the user’s password using a valid OTP and ensures the new password is different.
 * @async
 * @function resetPasswordWithOtpController
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const resetPasswordWithOtpController = async (req,res) => {
  try{
    const  {otp,email,newPassword} = req.body ; 
    if(!otp || !email ) {
      return res.status(400).json({
        success : false, 
        message: "Please fill in all fields"
      })
    }; 
    const user = await User.findOne({email}).select("+password"); 
    if(!user || !user.resetOtp.code){
      return res.status(400).json({
        success : false, 
        message : "No OTP request found"
      })
    }; 
    //check if otp expired
    if(user.resetOtp.expireAt < Date.now()) {
      user.resetOtp = { code : '', expireAt : 0, otpAttempts : 0};
      await user.save()
      return res.status(400).json({
        success : false, 
        message: 'OTP expired'
      });
    };
    //if many attempts 
    const MAX_ATTEMPT_OTP = 3
    if(user.resetOtp.otpAttempts >= MAX_ATTEMPT_OTP )  {
      user.resetOtp = {code:'', expireAt : 0, otpAttempts : 0}; 
      await user.save()
      return res.status(429).json({
        success: false, 
        message: 'To many attempts. Please request a new OTP'
      });
    }; 
    //Validate otp 
    const isValid = await Bcrypt.compare(otp,user.resetOtp.code); 
    if(!isValid) {
      user.resetOtp.otpAttempts += 1;
      await user.save();
      return res.status(400).json({
        success: false, 
        message  : "OTP invalide"
      })
    }; 

    //If valide but user enters same password
   const isPasswordMatchOldOne = await Bcrypt.compare(newPassword,user.password); 
   if(isPasswordMatchOldOne) {
    return res.status(400).json({
      success : false, 
      message : 'Password already exists. Please try again'
    })
   };
   //If valide
    const salt = await Bcrypt.genSalt(10)
    hashedNewPassword= await Bcrypt.hash(newPassword,salt); 
   user.password = hashedNewPassword
   user.resetOtp = { code : '', expireAt : 0, otpAttempts : 0};
    await user.save() ; 
    return res.status(201).json({
      success : true, 
      message : "Password has been reset successfully"
    });
  }catch(error) {
    console.error('Error from validate requested otp',error); 
    return res.status(500).json({
      success : false, 
      message : "Internal server error Please try again later."
    });
  };
};
/**
 * Logs out a user by clearing the authentication token cookie.
 * @async
 * @function logOutController
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {Promise<void>}
 */
const logOutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "strict" : "none",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in userLogOutController", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later",
    });
  }
};

module.exports = {
  userRegisterController,
  userLoginController,
  logOutController,
  sendOtpController, 
  otpVerificationController,
  requestOtpForPasswordReset,
  resetPasswordWithOtpController,  

};
