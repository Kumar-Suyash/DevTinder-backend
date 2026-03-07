const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//* Fields to expose from User documents
const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "about", "age", "gender"];

// ─────────────────────────────────────────────
//  GET /user/requests/received
//  Returns all PENDING (interested) connection requests sent TO the logged-in user
// ─────────────────────────────────────────────
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //* Fetch requests where logged-in user is the receiver and status is still "interested"
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending connection requests found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Pending connection requests fetched successfully",
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
});

// ─────────────────────────────────────────────
//  GET /user/connections
//  Returns all ACCEPTED connections (both sent and received) for the logged-in user
// ─────────────────────────────────────────────
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //* Find all accepted requests where the logged-in user is either sender or receiver
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    //* Extract only the "other" person from each connection (not the logged-in user)
    const connections = connectionRequests.map((connection) => {
      const isLoggedInUserSender =
        connection.fromUserId._id.toString() === loggedInUser._id.toString();

      return isLoggedInUserSender ? connection.toUserId : connection.fromUserId;
    });

    return res.status(200).json({
      success: true,
      message: "Connections fetched successfully",
      count: connections.length,
      data: connections,
    });
  } catch (err) {
    console.error("getConnections error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// ─────────────────────────────────────────────
//  GET /user/feed
//  Returns paginated profiles of users the logged-in user has NOT interacted with
//  (excludes: self, already sent/received requests, existing connections)
// ─────────────────────────────────────────────
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //* Pagination params from query string (e.g. /user/feed?page=2&limit=10)
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); //* cap at 50
    const skip = (page - 1) * limit;

    //* Find all connection requests involving the logged-in user (any status)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //* Build a Set of user IDs to exclude from the feed
    const excludedUserIds = new Set([loggedInUser._id.toString()]);

    connectionRequests.forEach((req) => {
      excludedUserIds.add(req.fromUserId.toString());
      excludedUserIds.add(req.toUserId.toString());
    });

    //* Fetch users NOT in the excluded set, only returning safe fields
    const feedUsers = await User.find({
      _id: { $nin: Array.from(excludedUserIds) },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    if (!feedUsers || feedUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found in feed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feed fetched successfully",
      page,
      limit,
      count: feedUsers.length,
      data: feedUsers,
    });
  } catch (err) {
    console.error("getFeed error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = userRouter;