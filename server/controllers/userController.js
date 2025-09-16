 const User = require('../models/userModel');
 const getAllUsers = async (req,res) =>  {
  try{
    const {user_id} = req.user
    const user = await User.findById(user_id); 
    if(!user) {
      return res.status(404).json({
        success: false, 
        message: 'User not found!'
      })
    } 
   return res.status(200).json({
      success: true, 
      userData : {
        id : user._id,
        name : user.username,
        isAccountVerified : user.isAccountVerified
      }
    })
      
  }
  catch(error) {
    console.error(`Error in users' controller`,error); 
    return res.status(500).json({
      success : false, 
      message : 'Internal server error. Please try again'
    })
  }
};
const deleteUser = async(req,res) => {
  try{
    const getUserId = req.params.id; 
    const user = await User.findByIdAndDelete(getUserId); 
    if(user) {
      return res.status(200).json({
        success: true, 
        message : `user with id ${getUserId} has been deleted successfully`
      })
    }
  }catch(error) {
    console.error('Error in delete a user controller ',error); 
    return res.status(500).json({
      succes: false, 
      message: 'Internal server error . Please try again later '
    })
  };
}

module.exports = {getAllUsers,deleteUser};