const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const { status, toUserId } = req.params;
        const fromUserId = req.user;
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" + status });
        }

        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.send("User not found")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{ fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId }],
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "You have already sent a connection request to this user" })
        }
        const newConnectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
        const data = await newConnectionRequest.save();

        res.json({
            message:
                req.user.firstName + " " + (status === 'ignored' ? "ignored " : "liked ") + toUser.firstName,
            data,
        });

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type " + status });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if (!connectionRequest) {
            return res.status(400).json({ message: "Connection request not found" + requestId });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({ message: "Request " + status, data })

    } catch (err) {
        res.send("ERRRO: " + err.message)
    }
})


module.exports = requestRouter;