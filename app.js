const express = require("express");
const expressSession = require("express-session");
const csrf = require("csurf");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");

const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middleware/csrf-token");
const errorHandlerMiddleware = require("./middleware/error-handler");
const checkAuthStatus = require("./middleware/check-auth");
const protectRoutesMiddleware = require("./middleware/protect-routes");
const cartMiddleware = require("./middleware/cart");

const createSessionConfig = require("./config/session");

const app = express();

// will use ejs-type files in the views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// all css files are stored in public folder
app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create a session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

app.use(cartMiddleware);

app.use(checkAuthStatus);

// to prevent csrf attack
app.use(csrf());
app.use(addCsrfTokenMiddleware);

// for error handling
app.use(errorHandlerMiddleware);

// routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use("/cart", cartRoutes);

app.use(protectRoutesMiddleware);
app.use("/admin", adminRoutes);

// connect to database
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
