const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRoutes = express.Router();
const mongoose = require("mongoose");

//* sendConnectionRequest
requestRoutes.post("/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user._id;
            const toUserId = new mongoose.Types.ObjectId(req.params.toUserId);
            const status = req.params.status;

            const allowedStatus = ["interested", "ignored"];

            if (!allowedStatus.includes(status)) {
                throw new Error("invalid Status Type" + status);
            }
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or: [
                    {fromUserId, toUserId},
                    {fromUserId: toUserId, toUserId: fromUserId},
                ]
            });
            if(existingConnectionRequest) {
               return res.status(400).json({ message: "Connection Request Already Exists !!"});
            }

            
            const connectRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });
            const data = await connectRequest.save();
            res.json({
                message: "Connection Request sent successfully",
                data,
            });
        } catch (err) {
            res.status(400).send("ERROR: " + err.message);
        }
    });


module.exports = requestRoutes;