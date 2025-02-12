const express = require('express')
const connectDB = require('./config/database')
const app = express();
const userSchema = require("./models/user");
const bcrypt = require('bcrypt')
const validator = require('validator');
var cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
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


app.get("/feed", async (req, res) => {
    try {

        const token = req.cookies.token;
        if (!token) {
            res.status(400).send({ message: "No token provided" })
        }
        const decode = await jwt.verify(token, process.env.SECERT_KEY);

        const user = await userSchema.findOne({_id:decode.id})
        if(!user){
            res.send("user not found please login")
        }

        res.send(user)
    } catch (err) {
        res.status(400).send("Error: " + err)
    }
})


app.delete("/deleteuser", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userSchema.findOneAndDelete({ email })
        return res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Error: " + err)
    }
})