const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validators');
const bcrypt = require('bcrypt')
const User = require("../models/user")

    //* Signup Controller
    authRouter.post("/signup", async (req, res) => {
    
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
    authRouter.post("/login", async (req, res) => {
    
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
                res.cookie("token", token, {
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

    //* Logout Controller
    authRouter.post("/logout", async (req, res) => {
        res.cookie("token", null,{
            expires: new Date(Date.now()),
        });
        res.send("logout Successful");
    });
module.exports = authRouter;