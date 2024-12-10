const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");  // Import the middleware

const userController = require("../controllers/users.js"); // Import user controller

// Signup Route
router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// Login Route
router
.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl,  // Save the redirect URL if not logged in
  passport.authenticate("local", {
    failureRedirect: "/login",  // Redirect on login failure
    failureFlash: true,         // Flash error message on failure
  }),
  userController.login      // Redirect after successful login
);

// Logout Route
router.get("/logout", userController.logout);

module.exports = router;
