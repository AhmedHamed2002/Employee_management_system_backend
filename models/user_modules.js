const  mongoose = require('mongoose');
const validator  = require('validator') ; 
const ROLES  =  require('../utils/roles'); 

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true
    } ,
    lastName : {
        type:String,
        required:true
    } , 
    email : {
        type:String,
        required:true,
        unique:true  , 
        validate:[validator.isEmail , 'invalid email']   
    } , 
    password : {
        type:String,
        required:true ,  
        minlength:[8 , 'password must be at least 8 characters']
    } , 
    role:{
        type:String ,  
        require:true , 
        default:'user' ,  
        enum:[ROLES.USER , ROLES.ADMIN , ROLES.MANAGER]
    }  ,  
    avatar:{
        type:String , 
        default:'https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757591957/EMS/users/wzch9thd6vqnvwi7hcvw.jpg'
    } ,
    avatar_public_id: { 
        type: String ,
        default: "EMS/users/wzch9thd6vqnvwi7hcvw"
    } ,  
    logged:{
        type:Boolean , 
        default:false
    } , 
    resetCode:{
        type:String
    },
    resetCodeExpire:{
        type:Date
    },       
});

module.exports = mongoose.model('User', userSchema);