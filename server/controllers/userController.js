const User = require('../models/userModel');

/**
 * @function getAllUsers
 * @description Retrieves the authenticated user's details from the database.
 * 
 * @async
 * @param {Object} req - Express request object containing `user` with `user_id`.
 * @param {Object} res - Express response object used to return JSON responses.
 * 
 * @returns {JSON} 
 * - 200: Returns user data (id, username, verification status).
 * - 404: User not found.
 * - 500: Internal server error.
 * 
 * @example
 * // Example response on success:
 * {
 *   "success": true,
 *   "userData": {
 *     "id": "64c8a12f9e8...",
 *     "name": "john_doe",
 *     "isAccountVerified": true
 *   }
 * }
 */
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

/**
 * @function deleteUser
 * @description Deletes a user by their ID.
 * 
 * @async
 * @param {Object} req - Express request object containing `params.id` (user ID).
 * @param {Object} res - Express response object used to return JSON responses.
 * 
 * @returns {JSON} 
 * - 200: User deleted successfully.
 * - 500: Internal server error.
 * 
 * @example
 * // Example response on success:
 * {
 *   "success": true,
 *   "message": "user with id 64c8a12f9e8... has been deleted successfully"
 * }
 */
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
