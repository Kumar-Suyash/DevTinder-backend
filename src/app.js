const express = require('express');
const app = express();
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRoutes = require('./routes/request');

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRoutes)

//* Database connection
connectDB()
    .then(() => {
        console.log("established connection for DB .....");

        app.listen(7777, () => {
            console.log("port is listening on port number 7777");
        });
    })
    .catch((err) => {
        console.error("failded to connect with db" + err);
    });


