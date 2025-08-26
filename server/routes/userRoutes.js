const express = require('express'); 
const router = express.Router(); 
const {authMiddleware} = require('../middlewares/userAuth');
const { getAllUsers,deleteUser } = require('../controllers/userController');
router.get('/users',authMiddleware,getAllUsers);
router.delete('/users',authMiddleware,deleteUser);
module.exports = router;
