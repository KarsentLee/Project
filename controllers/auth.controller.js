const authUtill = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");
const User = require("../models/user.model");

// this function is called when the user tries to access "/signup" page
function getSignup(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }
  res.render("customer/auth/signup", { inputData: sessionData });
}


// this function is called when the user tries to create an account from "/signup" page after putting required values
// the function then creates a user document with the values and redirect to "/login" page
async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

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
    sessionFlash.flashedDataToSession(
      req,
      {
        errorMessage: "check your input, you must type correct values",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  //

  // this calls the function to store a user document in the database
  try {
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashedDataToSession(
        req,
        {
          errorMessage:
            "user with the same email exists already, try another email address",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );

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
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }
  res.render("customer/auth/login", { inputData: sessionData });
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

  const sessionErrorData = {
    errorMessage: "either your email or password is wrong, please double check",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashedDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashedDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  // this creates a session based on the user's info
  authUtill.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}


function logout(req, res) {
  authUtill.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
