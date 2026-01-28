const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")
const { validateSignUpData } = require("./utils/validators")
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const {userAuth } = require("./middlewares/auth")

app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {

    try {
        //* Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //* Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)  //* 10 is salt value here
        //* Creating the new Instance of User Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
});

//* login Controller
app.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = user.validatePassword(password);

        if (isPasswordValid) {

            //* Create a JWT Token
            const token = await user.getJWT();
            //* Add token to the cookies and send the responce back to the server
            res.cookie("token", token , {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.status(200).send("login Successful!!!");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
});

//* Get Profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
//* Get sendConnectionRequest
app.post("/sendConnectionRequest", userAuth,  async (req, res) => {
    try{
        const user = req.user;
        //* sending connection request
        console.log("sending the connection request");
        res.status(200).send(user.firstName+" send you the connection request")
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


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


