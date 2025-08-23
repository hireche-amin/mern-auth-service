const User = require("../models/userModel");
const Jwt = require("jsonwebtoken");
const Bcrypt = require("bcryptjs");
const transporter = require("../utils/nodeMailer");
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
        message: "User allready exists. Please login or use a different email.",
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
        expiresIn: "3d",
      }
    );
    //send the token .
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "strict" : "none",
      expiresIn: 3 * 24 * 60 * 60,
    });

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Amin's academy for software development",
      text: `Welcome to amin's academy website. Your account has been created with email id ${email}  `,
    };
    await transporter.sendMail(mailOption);
    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
    /*
    //Generate otp 
    const otp = Math.floor(100000 * Math.random () * 900000).toString() ; 
     verifyOtp = otp ; 
     newlyCreatedUser.otpExpireAt = Date.now() + 10*60*1000
     await newlyCreatedUser.save(); 
     const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Email verification",
      text: `Verify your EMAIL, your OTP is ${otp}`,
    };
    await transporter.sendMail(mailOption);
    */
   

    res.status(201).json({
      success: true,
      message: "Account created successfully, please verify your email.",
    });

    

  } catch (error) {
    console.error("Error in userRegestrationController", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later",
    });
  }
};
const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    //Check user's email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(403).json({
        succes: false,
        message: "Invalide email or password",
      });
    }
    //Check user's password
    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(403).json({
        success: false,
        message: "Invalide email or password",
      });
    }

    //Generate a token
    const token = Jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );
    //cookie-config
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      samesite: process.env.NODE_ENV === "production" ? "strict" : "none",
      expiresIn: 3 * 24 * 60 * 60,
    });
    res.status(200).json({
      succes: true,
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
};
