const express = require('express');
const app = express();

app.use("/test",(req, res) =>{
    res.send("Hello from the server");
});

//! All the API call are handled over here and the orders also matter

//! And all the methods are matched over here
// app.use("/user",(req, res) =>{
//     res.send("HEHEHHE ......");
// });


//* This will handle only GET call from /user

app.get("/user" , (req , res ) => {
    res.send({firstname : "Kumar" , lastname : "Suyash"})
});

//* This will handle only POST call from /user

app.post("/user" , (req , res) =>{
    //! logic to save data in DB...
    res.send("Data is sucessfully saved in db")
});

//* This will handle only DELETE call from /user

app.delete("/user", (req, res) =>{
    res.send("Deleted successfully")
});

app.listen(7777,(req, res)=>{
    console.log("port is listening on port number 7777");
})

