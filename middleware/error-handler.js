function handleErrors(error, req, res, next) {
  res.status(500).render("shared/500");
}

module.exports = handleErrors;
