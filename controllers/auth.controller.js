const User = require("../models/user.model");

// this function is called when the user tries to access "/signup" page
function getSignup(req, res, next) {
  res.render("customer/auth/signup");
}

// this function is called when the user tries to create an account from "/signup" page after putting required values
// the function then creates a user document with the values and redirect to "/login" page
async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  // this calls the function to store a user document in the database
  await user.signup();

  // send the users to login page after successfully creating an account so that users can login
  res.redirect("/login");
}

function getLogin(req, res, next) {
  res.render("customer/auth/login");
}

module.exports = { getSignup: getSignup, getLogin: getLogin, signup: signup };
