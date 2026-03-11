const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validators');
const bcrypt = require('bcrypt');
const User = require("../models/user");

//* Signup Controller
authRouter.post("/signup", async (req, res) => {
    try {
        //* 1. Validate signup data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //* 2. Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        //* 3. Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10); //* 10 is salt value here

        //* 4. Create and save user
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        const savedUser = await user.save();

        //* 5. Generate JWT and set cookie on signup
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //* 7 days
            httpOnly: true,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                emailId: savedUser.emailId,
            },
        });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Internal server error",
        });
    }
});

//* Login Controller
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        //* 1. Basic field validation
        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        //* 2. Find user
        const user = await User.findOne({ emailId }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",  //! never reveal if email exists
            });
        }

        //* 3. Validate password
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",  //! same message for security
            });
        }

        //* 4. Generate JWT and set cookie
        const token = await user.getJWT();
        //* Add token to the cookies and send the responce back to the server
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //! 7 days
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                age: user.age,
                gender: user.gender,
                photoUrl: user.photoUrl,
                about: user.about,
                skills: user.skills,
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

//* Logout Controller
authRouter.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = authRouter;