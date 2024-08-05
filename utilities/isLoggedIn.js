const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You have to be logged in to do this.");
    return res.redirect("/home");
  }
  next();
};

module.exports = isLoggedIn;
