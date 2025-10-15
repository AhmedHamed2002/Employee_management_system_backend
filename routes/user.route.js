const express =  require('express');
const router = express.Router() ;  
const userController = require('../controller/user.controller');
const userValidation  = require('../middleware/user_validation');
const verify =  require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const Roles = require('../utils/roles');
const avatar =  require('../middleware/user_image_validation'); 


router.route('/').get(verify.verifyToken ,allowedTo(Roles.ADMIN , Roles.MANAGER)  ,userController.getAllUsers) ;  
router.route('/register').post(avatar.single("avatar"), userValidation.registerValidation(),userController.register) ; 
router.route('/login').post(userValidation.loginValidation(),userController.login) ;  
router.route('/check').get(verify.verifyToken,userController.check) ;  
router.route('/logout').get(verify.verifyToken,userController.logout) ;  
router.route('/profile').get(verify.verifyToken,userController.profile) 
                        .put(avatar.single("avatar") , verify.verifyToken,userValidation.profileValidation() ,userController.updateProfile);
router.route('/forgot-password').post(userValidation.forgetPasswordValidation(), userController.forgotPassword);
router.route('/reset-password').post(userValidation.resetPasswordValidation(), userController.resetPassword);


module.exports = router ; 