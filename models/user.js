const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
        lastName: { type: String },
        emailId: {
            type: String, required: true, trim: true, lowercase: true, unique: true, validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            }
        },
        password: {
            type: String, required: true
        },
        age: { type: Number, min: 18 },
        gender: {
            type: String, enum: {
                values: ['male', 'female', 'other'],
                // message: '{VALUE} is not a valid gender type',
            },
            validate(value) {
                if (!["male", "female", "other"].includes(value)) {
                    throw new Error("Gender is not a valid type")
                }
            }
        }


    }, {timestamps:true}
)

module.exports = mongoose.model("User", userSchema);