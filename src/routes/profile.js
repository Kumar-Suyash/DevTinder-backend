const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData, validateEditPasswordData } = require("../utils/validators");
const profileRouter = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

//* Get Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        console.error("getProfile error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

//* PATCH /editProfile controller
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            return res.status(400).json({
                success: false,
                message: "Invalid edit request",
            });
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();

        return res.status(200).json({
            success: true,
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        console.error("editProfile error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

//* PATCH /editPassword controller => forgot Password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        validateEditPasswordData(req);

        const { currentPassword, newPassword } = req.body;
        const loggedInUser = req.user;

        //* Fetch password explicitly (because it excluded  in userAuth)
        const userWithPassword = await User.findById(loggedInUser._id).select("+password");
        if (!userWithPassword) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //* Verify current password
        const isPasswordValid = await userWithPassword.validatePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        //* Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        //* Update password
        userWithPassword.password = newPasswordHash;
        await userWithPassword.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error("editPassword error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = profileRouter;