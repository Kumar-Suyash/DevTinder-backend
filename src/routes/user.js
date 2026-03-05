const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//*Get all the pending connection request for the loggedInUser
userRouter.get(
  "/user/requests/received",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
      }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "about", "age", "gender",]);

      if (!connectionRequests || connectionRequests.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No pending connection requests found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Connection requests fetched successfully",
        count: connectionRequests.length,
        data: connectionRequests,
      });

    } catch (err) {
      console.error("getReceivedRequests error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = userRouter;