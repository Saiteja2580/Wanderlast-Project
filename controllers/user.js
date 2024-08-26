const User = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
  res.render("./user/signUp.ejs");
};

module.exports.registerUser = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    // console.log(email, username);
    let user = new User({
      email: email,
      username: username,
    });

    let newUser = await User.register(user, password);
    //console.log(newUser);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("Success", "User Reistered Successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "User already Reistered");
    res.redirect("/signup");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.loginUser = (req, res) => {
  // No need to extract username and password again; passport handles it
  req.flash("success", "Welcome to Wonderlast! You are successfully logged in");
  if (res.locals.redirectUrl) {
    res.redirect(res.locals.redirectUrl);
  } else {
    res.redirect("/listings");
  }
  // Corrected path for redirect (ensure it's valid in your app)
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");

    res.redirect("/listings");
  });
};
