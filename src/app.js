const express = require('express');

const app = express();

//! app.use("/Route" , rH1 , [rH2 , rH3] , rH4)   rH => routeHandler
//* so for the same route me can handle it with multiple route handler
//* for this we are using next fxn and we can also pass routes in array its one in the same thing.

app.use(
    "/user",
    [(req, res, next) =>{
    console.log("handling the route user 1!!!")
    // res.send("Respone 1!!")
    next();
},
    (req, res, next) =>{
    console.log("handling the route user 2 !!!")
    // res.send(" 2nd Respone !!")  
    next();
},
    (req, res, next) =>{
    console.log("handling the route user 3 !!!")
    // res.send(" 3nd Respone !!")  
    next();
},
    (req, res, next) =>{
    console.log("handling the route user 4 !!!")
    res.send(" 4nd Respone !!")  
    
}],
);


app.listen(7777,(req, res)=>{
    console.log("port is listening on port number 7777");
})

