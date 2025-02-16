const express = require('express')
const connectDB = require('./config/database')
const app = express();
const cors = require('cors')
const User = require("./models/user");
var cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
app.use(express.json())
require('dotenv').config();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))


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



app.delete("/deleteuser", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndDelete({ email })
        return res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Error: " + err)
    }
})