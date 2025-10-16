require("dotenv").config();
const httpStatusText = require("./utils/httpStatusText");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

app.use(express.json());
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://employee-management-system-next-sab.vercel.app",
      "https://employee-management-system-backend-nine.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.options("*", cors());

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
