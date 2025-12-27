const express = require('express');
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

// app.use("/user", userAuth );

//*for login we don't need authentication

app.post("/user/login", (req, res) =>{
    res.send("login here...");
})
app.get("/user/getData", userAuth, (req, res) => {
    res.send("All data is feteched ....");

});


//* Handle Auth middleware for "/amdin" GET, POST ....REQUEST , 

app.use("/admin", adminAuth);

app.use("/admin/getAllData", (req, res) => {

    res.send(" All Data send");

})
app.use("/admin/deleteAllData", (req, res) => {

    res.send("Deleted All data");
})

app.listen(7777, (req, res) => {
    console.log("port is listening on port number 7777");
})

