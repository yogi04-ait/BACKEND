const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middleware/auth');
const connectionRequest = require('../models/connectionRequest');

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/request/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate("fromUserId", "firstName lastName")
        res.json({ message: "Data fetched successfully", data: connectionRequests });

    } catch (err) {
        res.status(500).json("ERROR: " + err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await connectionRequest.find({
            $or: [{ toUserId: loggedInUser._id, status: "accepted" },
            { fromUserId: loggedInUser._id, status: "accepted" }]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        console.log(connections)
        const data = connections.map((row)=>{
            if(row.fromUserId.toString() == loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.send({data})

    } catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})



module.exports = userRouter;