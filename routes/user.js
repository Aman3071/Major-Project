const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");


const userController = require("../controllers/users.js"); // Import user controller


//Signup Combine with route
router
.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));



//Login Combine with route
router
.route("/login")
.get(userController.renderLoginForm)
.post(
  saveRedirectUrl, // Middleware to save the redirect URL
  passport.authenticate("local", {
    failureRedirect: "/login", // Redirect on login failure
    failureFlash: true,        // Flash error message on failure
  }),
  userController.login
);


// Logout Route
router.get("/logout", userController.logout);

module.exports = router;
