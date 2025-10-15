require("dotenv").config();
const httpStatusText = require("./utils/httpStatusText");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: [
            "https://employee-management-system-backend-nine.vercel.app",
            "http://localhost:4000",
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

mongoose.connect(process.env.MONGO_URL);

// routers
const userRouter = require("./routes/user.route");
const employeeRouter = require("./routes/employee.route");

// middle ware
app.use("/system/user", userRouter);
app.use("/system/employee", employeeRouter);

app.use((req, res) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    message: "this  resourse is not available",
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("server is running .....");
});
