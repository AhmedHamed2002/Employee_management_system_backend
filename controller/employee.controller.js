const Employee = require('../models/employee_modules');
const User = require('../models/user_modules');
const  httpsStatusText  =  require('../utils/httpStatusText') ; 
const { validationResult , matchedData} =  require('express-validator') ; 
const Roles = require('../utils/roles');
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const cloudinary = require("cloudinary").v2;


const getAllEmployee = async(req  , res) =>{
    try{
        const query =  req.query ; 
        let  limit  = query.limit  ||  undefined; 
        let  page =  query.page || 1;     
        let  skip  =  (page-1) * limit ; 
        const employees = await Employee.find({} ,  { __v:0}).skip(skip).limit(limit) ;
        const views = employees.map(emp => {
            const view = {
                id: emp._id,
                name: emp.name,
                gender: emp.gender,
                address: emp.address,
                city: emp.city,
                birthday: moment(emp.birthday).tz("Africa/Cairo").format("DD/MM/YYYY"),
                age: emp.age,
                position: emp.position,
                department: emp.department,
                hireDate: moment(emp.hireDate).tz("Africa/Cairo").format("DD/MM/YYYY HH:mm"),
                image: emp.avatar
            };

            if (req.user && (req.user.role === Roles.ADMIN || req.user.role === Roles.MANAGER)) {
                view.salary = emp.salary;
                view.email = emp.email;
                view.phone = emp.phone;
                view.createdAt = moment(emp.createdAt)
                    .tz("Africa/Cairo")
                    .format("DD/MM/YYYY HH:mm");
                view.updatedAt = moment(emp.updatedAt)
                    .tz("Africa/Cairo")
                    .format("DD/MM/YYYY HH:mm");
            }

            return view;
        });      
        res.status(200).json({ 
            status: httpsStatusText.SUCCESS, 
            data: views  , 
            role: req.user.role
        });  
    }
    catch(err){
        res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const getSingleEmployee = async(req  , res) =>{
    try{
        const employee = await Employee.findOne({_id:req.params.id} ,  { __v:0}) ;
        if(!employee) return res.status(404).json({status:httpsStatusText.FAIL , data:"employee not found"}) ;
        const view = {
            id : employee._id , 
            name : employee.name ,
            gender: employee.gender,
            address: employee.address,
            city: employee.city,
            birthday: employee.birthday ,
            age: employee.age,
            position : employee.position , 
            department : employee.department , 
            hireDate :employee.hireDate,
            image:employee.avatar,
        } ; 
        if (req.user && (req.user.role === Roles.ADMIN || req.user.role === Roles.MANAGER)) {
            view.salary = employee.salary;
            view.email = employee.email;
            view.phone = employee.phone;
            view.createdAt = moment(employee.createdAt)
                .tz("Africa/Cairo")
                .format("DD/MM/YYYY HH:mm");
            view.updatedAt = moment(employee.updatedAt)
                .tz("Africa/Cairo")
                .format("DD/MM/YYYY HH:mm");
        } 
        view.role = req.user.role;
        res.status(200).json({status:httpsStatusText.SUCCESS , data:view}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const CreateEmployee =  async(req , res) =>{
    try{
        const errors = validationResult(req) ;
        if(!errors.isEmpty()) {
            if (req.file && req.file.path && req.file.filename !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status:httpsStatusText.FAIL , data:errors.array()})
        }
        
        const data = matchedData(req) ; 
        const today = new Date();
        data.age = today.getFullYear() - data.birthday.getFullYear();
        
        const oldEmployee = await Employee.findOne({email:data.email}) ; 
        if(oldEmployee){
            if (req.file && req.file.path && req.file.filename !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status:httpsStatusText.FAIL , data:"email alerady exist"}) ;
        } 
        
        let employee;    
        if(req.file && req.file.path){
            employee = new Employee({...data , avatar: req.file.path , avatar_public_id: req.file.filename}); 
        }
        else{
            employee = new Employee(data); 
        } 
        await employee.save() ; 

        return res.status(201).json({status:httpsStatusText.SUCCESS , data:"employee created successfully"}) ;
    }
    catch(err){
        if (req.file && req.file.path && req.file.filename !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const updateEmployee =  async(req , res) =>{
    try{
        const error  =  validationResult(req) ; 
        
        if(!error.isEmpty()){
            if (req.file && req.file.path && req.file.filename !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status:httpsStatusText.ERROR , message:error.array()}) ;
        }
        
        const data =  matchedData(req) ; 
        if(data.email){
            let isFind = await Employee.findOne({email:data.email}) ; 
            if(isFind && isFind._id.toString() !== data.id.toString()){
                if (req.file && req.file.path && req.file.filename !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
                return res.status(404).json({status:httpsStatusText.FAIL , data:"email already exist"});
            } 
        }
        
        if(data.birthday){
            const today = new Date();
            data.age = today.getFullYear() - data.birthday.getFullYear();
        }
        
        if (req.file && req.file.path) {            
            const employee = await Employee.findById(data.id);
            if (employee && employee.avatar_public_id && employee.avatar_public_id !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(employee.avatar_public_id);
            }   
            
            await Employee.updateOne({ _id: data.id },{ ...data, avatar: req.file.path , avatar_public_id: req.file.filename});
        } 
        else {
            await Employee.updateOne({ _id: data.id }, { ...data });
        }
        
        const  newUpdataEmployee  =  await Employee.findOne({_id:data.id} , {__v:0}) ;
        
        const view = {
            id : newUpdataEmployee._id , 
            name : newUpdataEmployee.name ,
            gender: newUpdataEmployee.gender,
            address: newUpdataEmployee.address,
            city: newUpdataEmployee.city,
            birthday: moment(newUpdataEmployee.birthday).tz("Africa/Cairo").format("DD/MM/YYYY"),
            age: newUpdataEmployee.age, 
            position : newUpdataEmployee.position , 
            department : newUpdataEmployee.department , 
            hireDate : moment(newUpdataEmployee.hireDate).tz("Africa/Cairo").format("DD/MM/YYYY HH:mm"), 
            image: newUpdataEmployee.avatar
        } ; 
        
        if (req.user && (req.user.role === Roles.ADMIN || req.user.role === Roles.MANAGER)) {
            view.salary = newUpdataEmployee.salary;
            view.email =  newUpdataEmployee.email;
            view.phone = newUpdataEmployee.phone;
            view.createdAt = moment(newUpdataEmployee.createdAt)
                .tz("Africa/Cairo")
                .format("DD/MM/YYYY HH:mm");
            view.updatedAt = moment(newUpdataEmployee.updatedAt)
                .tz("Africa/Cairo")
                .format("DD/MM/YYYY HH:mm");
        } 
        res.status(200).json({
            status:httpsStatusText.SUCCESS,
            data:view 
        }); 
    }
    catch(err){
        if (req.file && req.file.path && req.file.filename !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
        res.status(500).json({status:httpsStatusText.ERROR , message:"server error"}) ;
    }
}

const deleteEmployee =  async(req , res) =>{
    try{
        const employee = await Employee.findOne({_id:req.params.id}) ;
        if(!employee) return res.status(404).json({status:httpsStatusText.FAIL , data:"employee not found"}) ;
        
        if (employee && employee.avatar_public_id && employee.avatar_public_id !== "EMS/employees/xvjszdqfp2tfmjm1itwe") {
            await cloudinary.uploader.destroy(employee.avatar_public_id);
        }

        await Employee.deleteOne({_id:req.params.id}) ; 
        return res.status(200).json({status:httpsStatusText.SUCCESS , data:"employee deleted successfully"}) ;
    }
    catch(err){
        res.status(500).json({status:httpsStatusText.ERROR , message:"server error"}) ;
    }
}

const search = async (req, res) => {
    try {
        const { query } = req.query;
        const userRole = req.user?.role; 

        if (!query) return res.status(400).json({ status: httpsStatusText.FAIL, message: "Query is required" });

        let searchCriteria = [
            { name: { $regex: query, $options: "i" } },
            { position: { $regex: query, $options: "i" } },
            { department: { $regex: query, $options: "i" } },
            { address: { $regex: query, $options: "i" } },
            { city: { $regex: query, $options: "i" } },
            { gender: { $regex: `^${query}`, $options: "i" } },
        ];

        if (userRole !== Roles.USER) {
            searchCriteria.push(
                { email: { $regex: query, $options: "i" } },
                { phone: { $regex: query, $options: "i" } } ,
            );

            if (!isNaN(query)) {
                searchCriteria.push({ salary: Number(query) });
            }
        }

        if (!isNaN(query)) {
            searchCriteria.push({ age: Number(query) });
        }
        
        if (mongoose.Types.ObjectId.isValid(query)) {
            searchCriteria.push({ _id: new mongoose.Types.ObjectId(query) });
        }
        
        const results = await Employee.find({ $or: searchCriteria }, { __v: 0 });

        if (results.length === 0) return res.status(404).json({ status: httpsStatusText.FAIL, data: "No results found" });

        let view; 
        if (userRole === Roles.USER) {
            view = results.map(emp => ({
                id: emp._id,
                name: emp.name,
                gender: emp.gender,
                address: emp.address,
                city: emp.city,
                birthday: moment(emp.birthday).tz("Africa/Cairo").format("DD/MM/YYYY"),
                age: emp.age,
                position: emp.position,
                department: emp.department,
                hireDate: moment(emp.hireDate).tz("Africa/Cairo").format("DD/MM/YYYY HH:mm"),
                image: emp.avatar 
            }));
        } else {
            view = results.map(emp => ({
                id: emp._id,
                name: emp.name,
                gender: emp.gender,
                address: emp.address,
                city: emp.city,
                birthday: moment(emp.birthday).tz("Africa/Cairo").format("DD/MM/YYYY"),
                age: emp.age,
                position: emp.position,
                department: emp.department,
                image: emp.avatar ,
                salary: emp.salary,
                email: emp.email,
                phone: emp.phone,
                hireDate: moment(emp.hireDate).tz("Africa/Cairo").format("DD/MM/YYYY HH:mm"),
                createdAt: moment(emp.createdAt).tz("Africa/Cairo").format("DD/MM/YYYY HH:mm"),
                updatedAt: moment(emp.updatedAt).tz("Africa/Cairo").format("DD/MM/YYYY HH:mm"),
            }));
        }
        res.status(200).json({ status: httpsStatusText.SUCCESS, data: view , role: userRole });

    } catch (err) {
        res.status(500).json({ status: httpsStatusText.ERROR, message: "server error" });
    }
};

const homeStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const employeesCount = await Employee.countDocuments();
        const currentUser = await User.findById(req.user.id, { avatar: 1, _id: 0 });

        const data = {
            usersCount,
            employeesCount,
            avatar: currentUser ? currentUser.avatar : null , 
            role: req.user.role
        };

        return res.status(200).json({
            status: httpsStatusText.SUCCESS,
            data
        });

    } catch (err) {
        return res.status(500).json({
            status: httpsStatusText.ERROR,
            message: err.message
        });
    }
}; 


module.exports = {
    getAllEmployee , 
    CreateEmployee , 
    getSingleEmployee , 
    updateEmployee , 
    deleteEmployee , 
    search ,
    homeStats
}