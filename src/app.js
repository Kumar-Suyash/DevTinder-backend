require("dotenv").config();
const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(cors({
    origin:"http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRoutes = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRoutes);
app.use("/", userRouter);

//* Database connection
connectDB()
    .then(() => {
        console.log("DB connection established successfully");
        app.listen(process.env.PORT || 7777, () => {
            console.log(`Server is running on port ${process.env.PORT || 7777}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to DB:", err);
        process.exit(1);  // exit process if DB connection fails
    });