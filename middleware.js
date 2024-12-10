const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review");



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the current URL in session so the user can be redirected back after login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login"); // Redirect to login page
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract the `id` from the route parameters
        const listing = await Listing.findById(id); // Fetch the listing from the database

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings"); // Redirect to the listings page or another appropriate page
        }

        // Check if the current user is the owner of the listing
        if (!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this listing!");
            return res.redirect(`/listings/${id}`); // Redirect back to the listing page
        }

        next(); // If ownership is confirmed, proceed to the next middleware or route handler
    } catch (error) {
        console.error("Error in isOwner middleware:", error);
        req.flash("error", "Something went wrong!");
        return res.redirect("/listings"); // Redirect to a safe page in case of an error
    }
};




module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); // Validate the request body against the listing schema

    if (error) {
        const errorMessage = error.details.map((el) => el.message).join(", "); // Generate a user-friendly error message
        return next(new ExpressError(400, errorMessage)); // Pass the error to the error-handling middleware
    }

    next(); // If validation passes, proceed to the next middleware
};



module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate the request body against the review schema
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        return next(new ExpressError(400, errMsg)); // Throw a structured error for invalid data
    }
    next(); // If validation passes, proceed to the next middleware
};


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};