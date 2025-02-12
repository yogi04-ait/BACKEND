const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require("../middleware/auth");

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try {
        const { status, toUserId } = req.params;
        const formUserId = req.user;
        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type" + status });
        }
        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.send("User not found")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [{ formUserId, toUserId },
            { formUserId: toUserId, toUserId: formUserId }],
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "You have already sent a connection request to this user" })
        }
        const newConnectionRequest = new ConnectionRequest({ formUserId, toUserId, status });
        const data = await newConnectionRequest.save();
        res.json({
            message:
                req.user.firstName + " " + (status ==='ignored' ? "ignored " : "liked ") + toUser.firstName,
            data,
        });



    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = requestRouter;