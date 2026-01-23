import User from "../model/user.model.js";
import Frend from "../model/frend.model.js";
import GroupBalance from "../model/balance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const sendFriendRequest = asyncHandler(async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
        throw new ApiError(400, "You cannot send a friend request to yourself");
    }

    // Check if they are already friends or if a request is pending
    const existingRequest = await Frend.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    });

    if (existingRequest) {
        return res.status(400).json(new ApiResponse(400, null, "Friend request already exists or you are already friends"));
    }

    const friendRequest = await Frend.create({
        sender: senderId,
        receiver: receiverId,
        status: "pending"
    });

    res.status(201).json(new ApiResponse(201, friendRequest, "Friend request sent successfully"));
});


export const respondToFriendRequest = asyncHandler(async (req, res, next) => {
    const { requestId, action } = req.body; // action: "accepted" or "rejected"
    const userId = req.user._id;

    const friendRequest = await Frend.findById(requestId);

    if (!friendRequest) {
        throw new ApiError(404, "Friend request not found");
    }

    // Ensure only the receiver can accept the request
    if (friendRequest.receiver.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to respond to this request");
    }

    if (action === "accepted") {
        friendRequest.status = "accepted";
        await friendRequest.save();

        // Add each other to their respective friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.receiver }
        });

        await User.findByIdAndUpdate(friendRequest.receiver, {
            $addToSet: { friends: friendRequest.sender }
        });

        return res.status(200).json(new ApiResponse(200, friendRequest, "Friend request accepted"));
    } 
    
    if (action === "rejected") {
        // Option A: Delete the record
        await Frend.findByIdAndDelete(requestId);
        // Option B: Keep it and mark as rejected
        // friendRequest.status = "rejected";
        // await friendRequest.save();

        return res.status(200).json(new ApiResponse(200, null, "Friend request rejected"));
    }

    throw new ApiError(400, "Invalid action");
});



export const searchUserByname = asyncHandler(async (req, res) => {
  const { username } = req.query;

  if (!username) {
    throw new ApiError(400, "Username query parameter is required");
  }

  const users = await User.find(
    { name: { $regex: username, $options: "i" } },
    "name email phonenumber"
  );

  res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});

export const getDiscoverUsers = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Find all existing connections (any status)
    const existingConnections = await Frend.find({
        $or: [{ sender: userId }, { receiver: userId }]
    });

    // 2. Extract the IDs of people already connected to
    const connectedUserIds = existingConnections.map(conn => 
        conn.sender.toString() === userId.toString() ? conn.receiver : conn.sender
    );

    // 3. Find users NOT in that list and NOT the current user
    const availableUsers = await User.find({
        _id: { $nin: [...connectedUserIds, userId] }
    }).select("name email phonenumber");

    return res.status(200).json(
        new ApiResponse(200, availableUsers, "Available users fetched successfully")
    );
});


export const getUserSummary = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Get all friends (Accepted status)
    const friends = await Frend.find({
        $or: [{ sender: userId }, { receiver: userId }],
        status: "accepted"
    }).populate("sender receiver", "name email");

    // 2. Get all group balances for this user
    const groupBalances = await GroupBalance.find({ userId })
        .populate("groupId", "name");

    // 3. Calculate Total Owed and Total Debt
    // If balance is positive, others owe you (Owing). 
    // If negative, you owe others (Debt).
    let totalOwing = 0;
    let totalDebt = 0;

    groupBalances.forEach(gb => {
        if (gb.balance > 0) totalOwing += gb.balance;
        else if (gb.balance < 0) totalDebt += Math.abs(gb.balance);
    });

    return res.status(200).json(
        new ApiResponse(200, {
            friends,
            totalOwing,
            totalDebt,
            groupBalances // Shows balance per group
        }, "User summary fetched successfully")
    );
});




export default {
    sendFriendRequest,
    respondToFriendRequest,
   // searchUserByname
};
