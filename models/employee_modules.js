const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "Age must be at least 18"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["male", "female"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
    },
    birthday: {
        type: Date,
        required: [true, "Birthday is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    position: {
        type: String,
        required: [true, "Position is required"],
        trim: true,
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        enum: [
            "HR",
            "IT",
            "Finance",
            "Marketing",
            "Sales",
            "Operations",
            "Customer Support",
            "Management",
        ],
        trim: true,
    },
    hireDate: {
        type: Date,
        default: Date.now,
    },
    salary: {
        type: Number,
        required: [true, "Salary is required"],
        min: [0, "Salary must be a positive number"],
    },
        avatar: {
        type: String, 
        default: "https://res.cloudinary.com/dtnkj1dqe/image/upload/v1757593418/EMS/employees/xvjszdqfp2tfmjm1itwe.jpg",
    },
    avatar_public_id: {
        type: String,
        default: "EMS/employees/xvjszdqfp2tfmjm1itwe",
    },
},
{
    timestamps: true, // auto adds createdAt & updatedAt
}
);

module.exports = mongoose.model("Employee", employeeSchema);

