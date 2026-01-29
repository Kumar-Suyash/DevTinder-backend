const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName) {
        throw new Error("Invalid User Name");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid EmailId");
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Please Enter strong password");
    }
};

const validateEditProfileData = (req) => {

    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "gender", "age", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed;
};

const validateEditPasswordData = (req) => {

    const {currentPassword, newPassword} = req.body;

    if(!currentPassword || !newPassword) {
        throw new Error("Both current password and new password is required");
    }
    if(!validator.isStrongPassword(newPassword)) {
        throw new Error("New password is not strong enough");
    }
    if(currentPassword === newPassword) {
        throw new Error("New password must be different from Current password");
    }
    return true;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateEditPasswordData
};