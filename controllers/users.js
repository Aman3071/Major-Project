const User = require("../models/user"); // Ensure User is imported
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs"); // Ensure this view exists
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Create a new user instance
        const newUser = new User({ email, username });

        // Register the user with Passport.js
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        // Automatically log in the new user
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl; // Clear the redirect URL from the session
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message); // Show error message
        res.redirect("/signup"); // Redirect back to the signup page
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs"); // Ensure this view exists
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    const redirectUrl = res.locals.redirectUrl || "/listings"; // Redirect URL or fallback
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
