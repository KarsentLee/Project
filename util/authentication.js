function createUserSession(req, user, action) {
  req.session.uid = user._id.toString();
  req.session.isAdmin = user.isAdmin;
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null;
  req.session.isAdmin = null;
}
// usersession
module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
