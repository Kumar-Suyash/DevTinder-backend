-Create a Repository

-Initialize a repository

-node_module, package.json, packageLock.json

-Install express

-Create a server

-Listen to post 7777

-Write request handlers for "/home" and "/test"

-Install nodemon and update scripts inside package.json

- Play with routes and rotes extensions ex. "/" , "/home", "/home/2", "xyz"

- Order of the rotes matter a lot "/" --> better Understanding for this route.

- Install Postman App create Workspace/Collection > test an API call.

- Write logics to handle all the API call for GET, POST, PUT, PATCH, DELETE and test them on postman.

- Explore routes use of ?, +, (), * in the routes

- Use of regex in routes ex. /a/, /.*fly$/

- Reading the query params in routes

- Reading the dynamin routes

- Create a multiple route handler in the same route

- Understanding of res.send() and next() method

- If we dont use res.send() our postman will stuck and if we use next() in the last route it will 
  throw an error

- What is Middleware ? And why do we need it ?

- How express JS handles the request

- Difference between app.use() and app.all() 

- Write a dummy auth middleware for admin .

- Write a dummy auth middleware for all user Routes except "/user/login".  

- Error Handling using  app.use("/",(err, req, res, next) => {});
- Why we put this in last ? (For best practice)

---------------------------------------------------------------------------------------------------

- Create a free cluster om mongodb official website (mongoDB ATLAS)

- Install mongoose library

- Connect our application to the DataBase "connection-url/devTinder"

- call the connctDB function and connect database before starting the application on server port(7777)

- Create a userSchema and user model

- Create a signup API to add data to a database

- Push some dummy document using API call from postman

- Error handling using try catch

-------------------------------------------------------------------------------------------------

- Difference between JS Object vs JSON

- Add express.json middleware to our app to send data dynamically

- Make your signup API dynamic to recieve data from end user

- 

