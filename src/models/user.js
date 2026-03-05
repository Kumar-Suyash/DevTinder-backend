const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
        trim: true,                 
    },
    lastName: {
        type: String,
        trim: true,                 
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        select: false,              // never return password in queries by default
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password");
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 100,                
    },
    gender: {
        type: String,
        lowercase: true,           
        trim: true,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender must be male, female or other");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.freepik.com/premium-ai-image/contacts-icon-white-background_285698296.htm#fromView=keyword&page=1&position=26&uuid=dd45c7af-3d31-4c2e-89b8-239709bdecd9&query=User+profile",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid photo URL: " + value);
            }
        }
    },
    about: {
        type: String,
        default: "This is default about of the user!",
        maxLength: 500,           
        trim: true,
    },
    skills: {
        type: [String],
        default: [],
        validate(value) {
            if (value.length > 10) {    // limit skills array
                throw new Error("Cannot add more than 10 skills");
            }
        }
    },
},
{
    timestamps: true
});

//* JWT secret from env variable
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }      
    );
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

     const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);