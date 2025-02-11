const express = require('express')
const authRouter = express();
const validateSignUpData = require('../utils/validation')
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
            return res.send("Invalid email or password");
        }


        // Compare entered password with hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.send("Invalid email or password");
        }

        res.send("Login successful");

    } catch (error) {
        res.send(error);
    }
});


module.exports = authRouter;