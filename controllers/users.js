const User = require("../models/user");
const passport = require("passport");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!");

            // Redirect to the stored URL or fallback to the listings page
            const redirectUrl = req.session.returnTo || "/listings";
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


module.exports.login = (req, res) => {
    req.flash("success", "Welcome to Wanderlust! You are logged in!");

    // // Use the stored URL (from session) or fallback to /listings
    let redirectUrl = res.locals.redirectUrl || "/listings";

    // Redirect to the appropriate page
    res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
