const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) =>{
        try {
        const { token } = req.cookies || {};
        if (!token) {
            throw new Error("Invalid token !!!");
        }
        //* Validate token
        const decoded = jwt.verify(token, "Suyash!001$");
        const { _id } = decoded;
        const user = await User.findById(_id).select("-password");

        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
        } catch (err) {
            res.status(400).send("ERROR : " + err.message);
        }
    };

module.exports = {
userAuth,
};