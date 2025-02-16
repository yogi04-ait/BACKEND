const express = require('express')
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation')
const bcrypt = require('bcrypt');
const User = require('../models/user')

authRouter.post("/signup", async (req, res) => {
    try {
        //validation of data
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;

        // Encrypting password 
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, emailId, password: passwordHash })
        const savedUser = await user.save()
        const { password: _, ...userWithoutPassword } = savedUser.toObject();
        const token = await savedUser.getJWT();
        res.cookie("token", token)
        res.json({ message: "user saved successfully", data: userWithoutPassword })
    } catch (err) {
        res.send("Error" + err)
    }
});


authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find user by email and make sure to include the password field
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        // Compare entered password with hashed password
        const isValidPassword = await user.validatePassword(password);
        if (isValidPassword) {
            const token = await user.getJWT();
            const { password: _, ...userWithoutPassword } = user.toObject();
            res.cookie("token", token);
            res.send(userWithoutPassword);
        } else {
            throw new Error("Invalid credentials");
        }

    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
});



module.exports = authRouter;