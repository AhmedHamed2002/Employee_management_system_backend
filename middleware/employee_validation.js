const { body } = require("express-validator");

const createValidation = () => {
    return [
        body("name")
            .notEmpty().withMessage("Name is required")
            .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
            .trim(),

        body("gender")
            .notEmpty().withMessage("Gender is required")
            .isIn(["male", "female"]).withMessage("Gender must be male, female, or other"),

        body("address")
            .notEmpty().withMessage("Address is required")
            .isString().withMessage("Address must be a string")
            .trim(),

        body("city")
            .notEmpty().withMessage("City is required")
            .isString().withMessage("City must be a string")
            .trim(),

        body("birthday")
            .notEmpty().withMessage("Birthday is required")
            .isISO8601().withMessage("Birthday must be a valid date")
            .toDate() ,

        body("email")
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid")
            .normalizeEmail(),

        body("phone")
            .notEmpty().withMessage("Phone number is required")
            .isMobilePhone().withMessage("Invalid phone number")
            .trim(),

        body("position")
            .notEmpty().withMessage("Position is required")
            .trim(),

        body("department")
            .notEmpty().withMessage("Department is required")
            .isIn([
                "HR",
                "IT",
                "Finance",
                "Marketing",
                "Sales",
                "Operations",
                "Customer Support",
                "Management",
            ])
            .trim(),

        body("hireDate")
            .optional()
            .isISO8601().withMessage("Hire date must be a valid date"),

        body("salary")
            .notEmpty().withMessage("Salary is required")
            .isNumeric().withMessage("Salary must be a number")
            .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),

        body('avatar')
            .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757593418/EMS/employees/xvjszdqfp2tfmjm1itwe.jpg') ,
        
        body('avatar_public_id')
            .default('EMS/employees/xvjszdqfp2tfmjm1itwe')
    ];
};
const updateValidation = () => {
    return [
        body("id")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),

        body("name")
            .optional()
            .notEmpty().withMessage("Name is required")
            .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long")
            .trim(),

        body("gender")
            .optional()
            .notEmpty().withMessage("Gender is required")
            .isIn(["male", "female"]).withMessage("Gender must be male, female"),

        body("address")
            .optional()
            .notEmpty().withMessage("Address is required")
            .isString().withMessage("Address must be a string")
            .trim(),

        body("city")
            .optional()
            .notEmpty().withMessage("City is required")
            .isString().withMessage("City must be a string")
            .trim(),

        body("birthday")
            .optional()
            .notEmpty().withMessage("Birthday is required")
            .isISO8601().withMessage("Birthday must be a valid date")
            .toDate() ,

        body("email")
            .optional()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Email is invalid")
            .normalizeEmail(),

        body("phone")
            .optional()
            .notEmpty().withMessage("Phone number is required")
            .isMobilePhone().withMessage("Invalid phone number")
            .trim(),

        body("position")
            .optional()
            .notEmpty().withMessage("Position is required")
            .trim(),

        body("department")
            .optional()
            .notEmpty().withMessage("Department is required")
            .isIn([
                "HR",
                "IT",
                "Finance",
                "Marketing",
                "Sales",
                "Operations",
                "Customer Support",
                "Management",
            ])
            .trim(),

        body("hireDate")
            .optional()
            .isISO8601().withMessage("Hire date must be a valid date"),

        body("salary")
            .optional()
            .notEmpty().withMessage("Salary is required")
            .isNumeric().withMessage("Salary must be a number")
            .isFloat({ min: 0 }).withMessage("Salary must be a positive number"),

        body('avatar')
            .optional() 
            .default('https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757593418/EMS/employees/xvjszdqfp2tfmjm1itwe.jpg'),

        body('avatar_public_id')
            .optional()
            .default('EMS/employees/xvjszdqfp2tfmjm1itwe')
    ];
};

const  deleteValidation = () =>{
    return [
        body("id")
            .notEmpty().withMessage("ID is required")
            .isMongoId().withMessage("Invalid ID format"),
    ]
}

module.exports = { createValidation , updateValidation , deleteValidation };
