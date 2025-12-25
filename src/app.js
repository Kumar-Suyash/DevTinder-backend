const express = require('express');
const app = express();

app.use("/test",(req, res) =>{
    res.send("Hello from the server");
});

//* This will handle only GET call from /user

app.get("/user/:userID/:name/:password" , (req , res ) => {
    console.log(req.params);
    res.send({firstname : "Kumar" , lastname : "Suyash"})
});

app.listen(7777,(req, res)=>{
    console.log("port is listening on port number 7777");
})

