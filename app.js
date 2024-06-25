const express = require("express");
const csrf = require("csurf");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middleware/csrf-token");
const errorHandlerMiddleware = require("./middleware/error-handler");
const csurf = require("csurf");
const app = express();

// will use ejs-type files in the views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// all css files are stored in public folder
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

//  to prevent csrf attack
app.use(csrf());
app.use(addCsrfTokenMiddleware);

//  for error handling
app.use(errorHandlerMiddleware);

//  routes
app.use(authRoutes);

//  should connect to database when the server starts
db.connectToDatabase()
  .then(function () {
    app.listen(3000);
    // console.log("server is running and database connected");
    // testing localdwdsadwdasdasdw
  })
  .catch(function (error) {
    console.log("failed connecting to database");
    console.log(error);
  });
