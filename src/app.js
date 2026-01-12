const express = require('express');
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user")

app.use(express.json());

app.post("/signup", async (req, res) => {

    // //* Creating the new Instance of User Model
    const user = new User(req.body);

    try{
        await user.save();
    res.send("User Added Successfully");
    } catch(err) {
        res.status(400).send("error in saving the user:" + err.message);
    }
});

//* Get user by emailId
app.get("/user", async (req, res)=>{

    const userEmail = req.body.emailId;
    try{
            const users = await User.find({emailId: userEmail});
            if(users.length === 0){
                res.status(404).send("User not found");
            } else {
                res.send(users);
            }
    } catch {
        res.status(400).send("Something went wrong");
    }
    
})

//* feed API GET /feed - get all the users from the database

app.get("/feed", async (req, res) => {

    try{
        const users = await User.find({});
        res.send(users);
    } catch {
        res.status(400).send("Something went wrong");
    } 
});

connectDB()
    .then(() => {
    console.log("established connection for DB .....");

    app.listen(7777, () => {
    console.log("port is listening on port number 7777");
});
})
.catch((err) => {
    console.error("failded to connect with db" + err);
})


