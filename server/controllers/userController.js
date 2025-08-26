 const User = require('../models/userModel');
 const getAllUsers = async (req,res) =>  {
  try{
    const users = await User.find({}); 
    if(users.length > 0) {
      const userInfo = users.map(user => ({
        username : user.username, 
        isAccountVerified : user.isAccountVerified
      }))
      return res.status(200).json({
        success : true, 
        data : {
          userInfo
        }
      
      });
    }else{
      return res.status(404).json({
        succes :false, 
        message : "No user found"
      })
    };
  }catch(error) {
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
        message : `user with id ${getUserId} deleted successfully`
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