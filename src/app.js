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


