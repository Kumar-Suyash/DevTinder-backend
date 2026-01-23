const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.freepik.com/premium-ai-image/contacts-icon-white-background_285698296.htm#fromView=keyword&page=1&position=26&uuid=dd45c7af-3d31-4c2e-89b8-239709bdecd9&query=User+profile",
    },
    about: {
        type: String,
        default: "This is default about of the user!",
    },
    skills: {
        type: [String],
    },
},
    {
        timestamps: true
    });

module.exports = mongoose.model("User", userSchema);