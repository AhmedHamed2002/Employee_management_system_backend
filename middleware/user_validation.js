const {body}  =  require('express-validator') ;
const Roles = require('../utils/roles');

const  registerValidation = () =>{
    return [
        body('firstName')
            .notEmpty().withMessage('firstName is required'),
        body('lastName')
            .notEmpty().withMessage('lastName is required'),
        body('email')
            .notEmpty().withMessage('email is required')
            .isEmail().withMessage('email is invalid'),   
        body('password')
            .notEmpty().withMessage('password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('Password must contain at least one letter and one number') , 
        body('confirmPassword')
            .notEmpty().withMessage('Confirm password is required')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                throw new Error('Passwords do not match');
                }
                return true;
            }),
        body('avatar')
            .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757591957/EMS/users/wzch9thd6vqnvwi7hcvw.jpg'),
        body('avatar_public_id')
            .default('EMS/users/wzch9thd6vqnvwi7hcvw')
        //     ,
        // body('role')
        //     .default('user')
        //     .isIn([Roles.USER , Roles.ADMIN , Roles.MANGER])
        //     .withMessage('Role must be either user or admin')
    ] ; 
}
const  loginValidation = () =>{
    return [
        body('email')
            .notEmpty().withMessage('email is required')
            .isEmail().withMessage('email is invalid'),   
        body('password')
            .notEmpty().withMessage('password is required') 
    ] ; 
}

const  profileValidation = () =>{
    return [
        body('firstName') 
            .optional()
            .notEmpty().withMessage('value is required'),
        body('lastName') 
            .optional()
            .notEmpty().withMessage('value is required'),
        body('email')
            .optional()
            .isEmail().withMessage('email is invalid'),
        body('avatar')
            .optional()
            .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757591957/EMS/users/wzch9thd6vqnvwi7hcvw.jpg') ,
        body('avatar_public_id')
            .optional()
            .default('EMS/users/wzch9thd6vqnvwi7hcvw')
    ] ; 
}

const forgetPasswordValidation = () =>{
    return [
        body('email')
            .isEmail().withMessage('email is invalid'),
    ]
}

const resetPasswordValidation = () =>{
    return [
        body('email')
            .isEmail().withMessage('email is invalid'),
        body('newPassword')
            .notEmpty().withMessage('password is required')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('Password must contain at least one letter and one number') , 
        body("code")
        .isLength({ min: 6, max: 6 })
        .withMessage("Reset code must be 6 digits long")
        .isNumeric()
        .withMessage("Reset code must contain only numbers"),
        ]
}


module.exports= {
    registerValidation , 
    loginValidation , 
    profileValidation , 
    forgetPasswordValidation , 
    resetPasswordValidation
}