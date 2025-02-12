const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config()


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Please Login")
        }

        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById({ _id: decode._id })

        if (!user) {
            throw new Error("User not found")
        }

        req.user = user;
        next()

    } catch (err) {
        res.status(500).send("Internal Server Error")
    }

}

module.exports = { userAuth, }