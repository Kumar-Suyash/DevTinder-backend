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

- API --> Get user by emailId

- API --> feed API GET /feed - get all the users from the database

- API --> Create a delete user api

- API --> Update the user

- Explore the mongoose Documentation for Model methods

- What are the options in Model.findOneAndUpdate method

- API --> Update the user with emailId

----------------------------------------------------------------------------------------------------

- Explore Schematype options from the mongoose documentation

- Add require, unique, min, minLength, trim, lowercase etc... validation on schema

- Add default type on fields

- Create a custom validate function for gender

- Pass runValidator option in patch controller

- Add timestamps to the userSchema

- Add API level validation on patch request & signup post Api

- DATA SANITIZING - Add api validation for each field

- Install validator

- Use validator function library for password, email, photo_Url

- NEVER TRUST req.body

- Validate data in signup Api

- Install bcrypt package

- Create passwordhash using bcrypt.hash(password, salt) & save the user in encrupted password

- Create a login Api

- Compare passwords and throw errors if email or password is invalid

- Install cookies-parser and send dummy cookies to user

- Create GET /profile API and check we get the cookie back

- Install jsonwebtoken

- In /login API, after email and password validation, create a JWT token and send it to user in cookies

- Read the cookies inside your profile API and find the logged in user 

- userAuth middleware

- Add the userAuth middleware in profile and sendConnectionRequest API

- Set the expiry of jwt token and cookies to 7 days

- Create userSchema method getJWT();

- Create userSchema method validatePassword(passwordInputByUser);

-----------------------------------------------------------------------------------------------------------

- Create a list of all APIs for DEV-TINDER app

- Group multiple route under respective routers

- Read express documentation for express.Routes

- Create Routes folder for managing auth, profile, request routers

- Create authRoutes, profileRoutes, requestRoutes

- Import these routes in app.js


