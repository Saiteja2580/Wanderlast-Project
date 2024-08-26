const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapAsync.js");
//const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//rendering signup form and registering user in db
router
  .route("/signup")
  .get(userController.renderSignUp)
  .post(userController.registerUser);

//rendering login form and logging in
router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login", // Redirect if authentication fails
      failureFlash: true, // Enable flash messages for failures
    }),
    userController.loginUser
  );

router.get("/logout", userController.logout);

module.exports = router;
