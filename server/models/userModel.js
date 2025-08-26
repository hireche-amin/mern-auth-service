
const mongoose = require('mongoose'); 
const userSchema = mongoose.Schema({
    username : {
        type : String, 
        required : true, 
        maxLength :[20 , 'Username can not exceed 20 characters'], 
        minLenght : [3, "Username must be at least 3 characters "], 
        unique : true, 
        match : [/^[a-zA-Z0-9_]+$/]
    }, 
    email : {
        type : String, 
        required : true, 
        trim : true, 
        lowercase : true,
        unique: true,
        match : [/^\S+@\S+\.\S+$/, "Please enter a valid email address" ]
    }, 
    password : {
        type : String, 
        required : true , 
        select : false
        
    }, 
    verifyOtp : {
        type : String, 
        default : ''
    }, 
    otpExpireAt : {
        type : Date, 
        default : 0
    }, 
    isAccountVerified : {
        type : Boolean, 
        default : false
    }, 
    resetOtp : {
        code : {
            type : String ,
            default : ''
        },
        expireAt : { 
            type : Number, 
            default : 0
        },
        otpAttempts : {
            type : Number, 
            default : 0
        }
    }
},
{
    timestamps : true
}); 
module.exports = mongoose.model("user",userSchema);