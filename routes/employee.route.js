const  express  =  require('express');
const  router  =  express.Router()  ; 
const employeeController = require('../controller/employee.controller');
const employeeValidation  = require('../middleware/employee_validation');
const verify =  require('../middleware/verifyToken');
const allowedTo = require('../middleware/allowedTo');
const Roles = require('../utils/roles');
const avatar =  require('../middleware/employee_image_validation'); 


router.route('/').get(verify.verifyToken,employeeController.getAllEmployee) ; 
router.route('/create').post(verify.verifyToken,allowedTo(Roles.ADMIN , Roles.MANAGER),avatar.single("avatar") , employeeValidation.createValidation() , employeeController.CreateEmployee) ;
router.route('/update').put(verify.verifyToken,allowedTo(Roles.ADMIN , Roles.MANAGER),avatar.single("avatar") , employeeValidation.updateValidation() , employeeController.updateEmployee) ;
router.route('/search').get(verify.verifyToken,employeeController.search) ;
router.route('/home_stats').get(verify.verifyToken,employeeController.homeStats) ;
router.route('/:id').get(verify.verifyToken,employeeController.getSingleEmployee)
                    .delete(verify.verifyToken,allowedTo(Roles.MANAGER),employeeValidation.deleteValidation() , employeeController.deleteEmployee) ; 


module.exports = router ; 