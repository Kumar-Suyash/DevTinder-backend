const express = require('express');
const app = express();

app.get("/getUserData", (req, res, next) => {
    try {
        // *Logic for fetching data from DB
        throw new Error("Database failure");

        res.send("User data sent");
    } catch (err) {
        // res.status(500).send("faliure in fetching data")
        next(err);

    }
});


app.use("/",(err, req, res, next) => {
    if (err) {
        console.error(err.message); // log error
        res.status(500).send("Something went wrong");
    }
});

app.listen(7777, () => {
    console.log("port is listening on port number 7777");
});
