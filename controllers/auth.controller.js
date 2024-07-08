const authUtill = require("../util/authentication");
const validation = require("../util/validation");

const User = require("../models/user.model");

// this function is called when the user tries to access "/signup" page
function getSignup(req, res, next) {
  res.render("customer/auth/signup");
}

// this function is called when the user tries to create an account from "/signup" page after putting required values
// the function then creates a user document with the values and redirect to "/login" page
async function signup(req, res, next) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  // check if the user has put all the required values to signup
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    res.redirect("/signup");
    return;
  }
  //

  // this calls the function to store a user document in the database
  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      res.redirect("/signup");
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  // send the users to login page after successfully creating an account so that users can login
  res.redirect("/login");
}
//

function getLogin(req, res, next) {
  res.render("customer/auth/login");
}
//

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    res.redirect("/login");
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    res.redirect("/login");
    console.log("failed typing correct pswrd");
    return;
  }

  authUtill.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}
//

function logout(req, res) {
  authUtill.destroyUserAuthSession(req);
  res.redirect("/login");
}

//
module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
