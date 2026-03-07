const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRoutes = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

//* sendConnectionRequest
requestRoutes.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      //* 1. Validate status
      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status "${status}". Allowed values: ${allowedStatus.join(", ")}`,
        });
      }

      //* 2. Validate toUserId format
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID format",
        });
      }

      //* 4. Check if toUserId actually exists in DB
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      //* 5. Check for existing request (both directions)
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({
          success: false,
          message: "Connection request already exists",
        });
      }

      //* 6. Create and save the request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      return res.status(201).json({
        success: true,
        message: `Connection request ${status === "interested" ? "sent" : "ignored"} successfully`,
        data,
      });

    } catch (err) {
      console.error("sendConnectionRequest error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

//* reviewConnectionRequest
requestRoutes.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //* 1. Validate status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status "${status}". Allowed values: ${allowedStatus.join(", ")}`,
        });
      }

      //* 2. Validate requestId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid request ID format",
        });
      }

      //* 3. Find the connection request with all conditions
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,   //? logged-in user must be the RECEIVER
        status: "interested",          //? can only review pending requests
      });

      //* 4. Handle not found (covers: wrong id, wrong user, already reviewed)
      if (!connectionRequest) {
        return res.status(404).json({
          success: false,
          message: "Connection request not found or already reviewed",
        });
      }

      //* 5. Update and save
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      return res.status(200).json({
        success: true,
        message: `Connection request ${status} successfully`,
        data,
      });

    } catch (err) {
      //* 6. Catch unexpected errors
      console.error("reviewConnectionRequest error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);


module.exports = requestRoutes;