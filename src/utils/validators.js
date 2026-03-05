const validator = require("validator");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required");
    }
    if (firstName.length < 4 || firstName.length > 50) {        
        throw new Error("First name must be between 4 and 50 characters");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must contain uppercase, lowercase, number and special character");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = [
        "firstName", "lastName", "photoUrl",
        "gender", "age", "about", "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
};

const validateEditPasswordData = (req) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new Error("Both current and new password are required");
    }
    if (!validator.isStrongPassword(newPassword)) {
        throw new Error("Password must contain uppercase, lowercase, number and special character");
    }
    if (currentPassword === newPassword) {
        throw new Error("New password must be different from current password");
    }
    return true;
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateEditPasswordData,
};