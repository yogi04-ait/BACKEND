const express = require('express')
const connectDB = require('./config/database')
const app = express();
const User = require("./models/user");
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const {userAuth}  = require("./middleware/auth")
app.use(express.json())
require('dotenv').config();

app.use(cookieParser())
connectDB().then(() => {
    app.listen(7000, () => {
        console.log("Server is listening")
    });
}).catch(err => {
    console.log(err.message)
})

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

app.get("/feed",userAuth, async (req, res) => {
    try {
        const user = req.user;
       

        res.send(user)
    } catch (err) {
        res.status(400).send("Error: " + err)
    }
})


app.delete("/deleteuser", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({ email })
        return res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Error: " + err)
    }
})