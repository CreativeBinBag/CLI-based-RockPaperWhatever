const express = require('express');
const {register,login, pwdResetReq, pwdReset, logout, getAllUsers, toggleBlockUser, deleteUser, updateUserRole, checkAuthStatus} = require('../controller/userController');
const userAuth = require('../Middleware/userAuth');
const {authenticateUser, authorizeAdmin} = require('../Middleware/privileges');


const router = express.Router()


//public routes
router.post('/register', userAuth.saveUser, register)
router.post('/login', login )
router.post('/forgot-password', pwdResetReq);
router.post('/reset-password/:token', pwdReset);


// Admin protected routes (admin authorization required)
router.get('/manage-users', authenticateUser, authorizeAdmin, getAllUsers);
router.put('/:id/block-toggle', authenticateUser, authorizeAdmin, toggleBlockUser);
router.delete('/:id/delete',authenticateUser, authorizeAdmin, deleteUser);
router.put('/:id/updateRole', updateUserRole);
router.get('/check-auth-status', authenticateUser, checkAuthStatus);
router.post('/logout',authenticateUser, logout);


module.exports = router