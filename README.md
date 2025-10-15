# 🧩 Employee Management System Backend

A robust and scalable **Node.js + Express** backend for managing employee and user data.  
This API supports **CRUD operations**, **authentication**, **authorization**, and **data persistence** using **MongoDB**.  
Designed for integration with a modern frontend (Angular or React) for full-stack employee management.

---

## 🚀 Features

### 👨‍💼 Employee Management
- ✅ Create, Read, Update, and Delete (CRUD) employees  
- 🧮 Employee fields include:
  - ID, Name, Email, Position, Department, Gender, City  
  - Age, Salary, Phone, Hire Date, Birthday, Image  
  - CreatedAt, UpdatedAt  

### 👤 User Management & Authentication
- 🔐 **Register** new users (Admin or Employee)
- 🔑 **Login** with email and password
- 🧾 **JWT-based authentication** and token verification
- 🧍 **Profile** view and **Edit Profile**
- 🔄 **Password reset workflow** (Forget & Reset password)
- 🔎 **Auth check** endpoint for validating user sessions
- 📁 Secure routes with middleware authentication guard

---

## 🏗️ Tech Stack

- **Node.js**  
- **Express.js**  
- **MongoDB + Mongoose**  
- **JWT (JSON Web Token)**  
- **bcryptjs** (for password hashing)  
- **dotenv**  
- **cors**, **helmet**, **morgan** (for security and logging)  
- **nodemailer** (for forget/reset password emails)

---

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Employee_management_system_backend.git
   cd Employee_management_system_backend

