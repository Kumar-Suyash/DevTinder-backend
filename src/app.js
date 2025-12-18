const express = require('express');
const app = express();


app.use("/",(req, res)=>{
    res.send("Hello from the dashboard!");
});

app.use("/test",(req, res) =>{
    res.send("Hello from the server");
});

app.use("/home",(req,res)=>{
    res.send("Hello Hello Hello from the home route");
});

app.listen(7777,(req, res)=>{
    console.log("port is listening on port number 7777");
})

