const Listing = require("../models/listing");
const Review = require("../models/review");



const mongoose = require("mongoose");

module.exports.createReview = async (req, res) => {
    try {
        // Check if the listing exists
        const listing = await Listing.findById(req.params.id).populate("owner");

        if (!listing) {
            req.flash("error", "Listing not found!"); // Flash an error message
            return res.redirect("/listings"); // Redirect to the listings page
        }

        // Create the new review
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        // Associate the review with the listing
        listing.reviews.push(newReview);

        // Save both the review and the listing
        await newReview.save();
        await listing.save();

        req.flash("success", "New review created successfully!");
        return res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        // Log the error for debugging
        console.error("Error creating review:", err);

        // Handle unexpected errors
        req.flash("error", "An error occurred. Please try again later.");
        res.redirect("/listings"); // Redirect to a safe fallback page
    }
};




module.exports.destroyReview = async(req,res) => {
    let {id, reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
    
  };    

