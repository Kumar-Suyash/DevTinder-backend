const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")
const {validateSignUpData} = require("./utils/validators")
const bcrypt = require('bcrypt')

app.use(express.json());

app.post("/signup", async (req, res) => {

    try {
    //* Validation of data
    validateSignUpData(req);

    const {firstName, lastName, emailId, password} = req.body;

    //* Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10)  //* 10 is salt value here
    console.log(passwordHash);

    //* Creating the new Instance of User Model
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });

        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
});

//* login Controller
app.post("/login", async (req, res) => {
    try{

        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            res.status(200).send("login Successful!!!");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR :" + err.message);
    }
});

//* Get user by emailId
app.get("/user", async (req, res) => {

    const userEmail = req.body.emailId;
    try {
        const users = await User.find({ emailId: userEmail });
        if (users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
    } catch {
        res.status(400).send("Something went wrong");
    }

});

//* Delete user by id
app.delete("/user", async (req, res) => {

    const userId = req.body.userId;
    try {
        // const user = await User.findByIdAndDelete({_id: userId});
        const user = await User.findByIdAndDelete(userId);

        res.send("User deleted successfully");
    } catch {
        res.status(400).send("Something went wrong");
    }
});

//* Update data of the user
app.patch("/user/:userId", async (req, res) => {

    const userId = req.params?.userId;
    const data = req.body;
    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills", "password"];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if (data.skills && data.skills.length > 10) {
            throw new Error("Skills can't be greater than 10");
        }
        const user = await User.findByIdAndUpdate(
            {_id: userId},
            data,
            {returnDocument: "after", runValidators: true},
            
        );
        console.log(user);
        res.send("User Updated sucessfully");
    } catch (err) {
        res.status(400).send("Update Failed:" + err.message);
    }
});

//* feed API GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    } 
    catch {
        res.status(400).send("Something went wrong");
    }
});


//* Database connection
connectDB()
    .then(() => {
        console.log("established connection for DB .....");

        app.listen(7777, () => {
            console.log("port is listening on port number 7777");
        });
    })
    .catch((err) => {
        console.error("failded to connect with db" + err);
    });


