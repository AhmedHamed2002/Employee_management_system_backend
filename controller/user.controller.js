const User = require('../models/user_modules');
const  httpsStatusText  =  require('../utils/httpStatusText') ; 
const { validationResult , matchedData} =  require('express-validator') ; 
const bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const transporter = require("../utils/email");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;


const getAllUsers= async(req  , res) =>{
    try{
        const users = await User.find({} ,  {password:0 , token:0 , __v:0 , _id:0}) ; 
        const view = users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            image: user.avatar,
            logged: user.logged
        }));
        res.json({status:httpsStatusText.SUCCESS , data:view});    
    }
    catch(err){
        res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            if (req.file && req.file.path && req.file.filename !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status: httpsStatusText.FAIL,data: errors.array(),});
        }
        
        const data = matchedData(req);

        const oldUser = await User.findOne({ email: data.email });
        if (oldUser){
            if (req.file && req.file.path && req.file.filename !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status: httpsStatusText.FAIL,data: "user already exist"});
        } 

        // hash password
        const myPlaintextPassword = data.password;
        data.password = await bcrypt.hash(myPlaintextPassword, 10);

        let userData = { ...data };

        if (req.file && req.file.path) {
            userData.avatar = req.file.path;       
            userData.avatar_public_id = req.file.filename
        }

        const user = new User(userData);
        await user.save();

        return res.status(201).json({status: httpsStatusText.SUCCESS,data: "user created successfully",});
    } catch (err) {
        if (req.file && req.file.path && req.file.filename !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
        return res.status(500).json({status: httpsStatusText.ERROR,message: err.message,});
    }
};

const login =  async(req , res) =>{

    try{
        const errors = validationResult(req) ;
        if(!errors.isEmpty()) return res.status(400).json({status:httpsStatusText.FAIL , data:errors.array()})
        
        const data = matchedData(req) ; 
        const user = await User.findOne({email:data.email}) ; 
        if(user) {
            const match = await bcrypt.compare(data.password , user.password) ; 
            if(match){
                //gen token
                const dataInToken = {
                    firstName : user.firstName , 
                    lastName : user.lastName , 
                    email : user.email , 
                    role : user.role , 
                    id : user._id
                }
                let token = jwt.sign(dataInToken, process.env.JWT_SECRET_KEY , {expiresIn:'24 h'});
                user.logged  =  true ; 
                await user.save() ; 
                return res.status(200).json({status:httpsStatusText.SUCCESS , data:"login successfully" , token}) ; 
            }
        } 
        return res.status(400).json({status:httpsStatusText.FAIL , data:"email or password is incorrect"})
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const logout =  async(req , res) =>{
    try{
        const user = await User.findOne({email:req.user.email}) ;
        user.logged  =  false ; 
        await user.save() ; 
        return res.status(200).json({status:httpsStatusText.SUCCESS , data:"logout successfully"}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
    
}

const check  =  async(req , res) =>{
    try{
        const user = await User.findOne({email:req.user.email}) ;
        if(user.logged === true) 
            return res.status(200).json({status:httpsStatusText.SUCCESS , data:"user is logged in"}) ;
        else 
            return res.status(401).json({status:httpsStatusText.FAIL , data:"user is not logged in"}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const  profile  =  async(req , res) =>{
    try{
        const user = await User.findOne({email:req.user.email}) ;
        const view = {
            firstName: user.firstName , 
            lastName: user.lastName , 
            email: user.email , 
            role: user.role , 
            image: user.avatar
        }
        return res.status(200).json({status:httpsStatusText.SUCCESS , data:view}) ;
    }
    catch(err){
        return res.status(500).json({status:httpsStatusText.ERROR , message:err.message}) ; 
    }
}

const updateProfile = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()){
            if (req.file && req.file.path && req.file.filename !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
            return res.status(400).json({status: httpsStatusText.ERROR,message: error.array()});
        } 

        const data = matchedData(req);
        if (data.email) {
            let isFind = await User.findOne({ email: data.email });
            if (isFind && isFind._id.toString() !== req.user.id.toString())
            {
                if (req.file && req.file.path && req.file.filename !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                    await cloudinary.uploader.destroy(req.file.filename);  
                }
                return res.status(404).json({status: httpsStatusText.FAIL,data: "email already exist",});
            }
        }

        let updateFields = { ...data };
        
        if (req.file && req.file.path) {
            const user = await User.findById(req.user.id);

            if (user && user.avatar_public_id && user.avatar_public_id !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                await cloudinary.uploader.destroy(user.avatar_public_id);
            }   
            
            updateFields.avatar = req.file.path;
            updateFields.avatar_public_id = req.file.filename ; 
        }

        await User.updateOne({ _id: req.user.id }, updateFields);

        const newUpdataUser = await User.findOne({ _id: req.user.id },{ password: 0, logged: 0, __v: 0, _id: 0 });

        const view = {
        firstName: newUpdataUser.firstName,
        lastName: newUpdataUser.lastName,
        email: newUpdataUser.email,
        role: newUpdataUser.role,
        image: newUpdataUser.avatar,
        };

        res.status(200).json({status: httpsStatusText.SUCCESS,data: view,});
    } 
    catch (err) {
        if (req.file && req.file.path && req.file.filename !== "EMS/users/wzch9thd6vqnvwi7hcvw") {
                await cloudinary.uploader.destroy(req.file.filename);  
            }
        res.status(500).json({ status: httpsStatusText.ERROR, message: "server error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({status: httpsStatusText.FAIL, message: "User not found" });
    }
    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCode = resetCode;
    user.resetCodeExpire = Date.now() + (60*60*1000); // 1 hour ===> m * s(60) * ms(1000)
    await user.save();
    
    await transporter.sendMail({
        from: `"Support Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${resetCode}`,
    });

    res.json({status: httpsStatusText.SUCCESS, message: "Reset code sent to email" });
};

const resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({
        email,
        resetCode: code,
        resetCodeExpire: { $gt: Date.now() }, // is vaild
    });

    if (!user) {
        return res.status(400).json({status: httpsStatusText.FAIL, message: "Invalid or expired code" });
    }

    //  new password
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;

    // delete code  
    user.resetCode = undefined;
    user.resetCodeExpire = undefined;
    await user.save();

    res.json({status: httpsStatusText.SUCCESS, data: "Password reset successfully" });
};

module.exports = {
    getAllUsers ,
    register ,
    login ,
    logout,
    check ,
    profile ,
    updateProfile ,
    forgotPassword ,
    resetPassword
} ;