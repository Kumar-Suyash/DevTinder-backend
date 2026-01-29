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
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

//* PATCH /editProfile controller
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {

    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);

        await loggedInUser.save()
        res.json({
            message: `${loggedInUser.firstName}, your profile updated sucessfully`,
            data: loggedInUser,
        });
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

  //* PATCH /editPassword  controller  ==> forgot Password
    profileRouter.patch("/profile/password", userAuth, async (req, res) => {

        try {
            validateEditPasswordData(req);

            const { currentPassword, newPassword } = req.body;
            const loggedInUser = req.user;

            //* Fetch password explicitly (because it excluded  in userAuth)
            const userWithPassword = await User.findById(loggedInUser._id).select("+password");
            if (!userWithPassword) {
                throw new Error("User not found");
            }

            //* Verify current password
            const isPasswordValid = await userWithPassword.validatePassword(currentPassword);
            if (!isPasswordValid) {
                throw new Error("Current password is incorrect");
            }

            //* Hash new password
            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            //* Update password
            userWithPassword.password = newPasswordHash;
            await userWithPassword.save();

            res.status(200).json({
                message: "Password updated successfully",
            });
        }
        catch (err) {
            res.status(400).send("ERROR: " + err.message);
        }
    });

module.exports = profileRouter;