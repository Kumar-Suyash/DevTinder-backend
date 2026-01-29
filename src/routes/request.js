const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRoutes = express.Router();

//* Get sendConnectionRequest
requestRoutes.post("/sendConnectionRequest", userAuth, async (req, res) => {
    try {
        const user = req.user;
        //* sending connection request
        console.log("sending the connection request");
        res.status(200).send(user.firstName + " send you the connection request")
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});


module.exports = requestRoutes;