const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()


const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
        lastName: { type: String },
        emailId: {
            type: String, required: true, trim: true, lowercase: true, unique: true,
        },
        password: {
            type: String, required: true
        },
        age: { type: Number, min: 18 },
        gender: {
            type: String, enum: {
                values: ['male', 'female', 'other'],
            },
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender is not a valid type")
                }
            }
        },
        about: {
            type: String,
            default: "Love to connect people around me!",
        },
        skills: {
            type: [String],
        },
        photoUrl: {
            type: String,
            default: "https://geographyandyou.com/images/user-profile.png",
            validate(value) {
                if (!validator.isURL(value)) {
                    throw new Errow("Invalid photo url");
                }
            }
        },


    }, { timestamps: true }
)

userSchema.methods.getJWT = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });
    return token;
}


userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const isValidPassword = await bcrypt.compare(passwordInput, user.password);
    return isValidPassword;
}


module.exports = mongoose.model("User", userSchema);