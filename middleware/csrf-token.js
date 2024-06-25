function addCsrfToken(req, res, next) {
  //   create a csrfToken in locals field to safely send data
  res.locals.csrfToken = req.csrfToken();
  next();
}

module.exports = addCsrfToken;
