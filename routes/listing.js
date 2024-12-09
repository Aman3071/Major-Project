const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
// const ExpressError = require("../utils/ExpressError.js")
// const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../controllers/listings.js");


//Index Route & Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Handle GET request to show all listings
  .post(
    isLoggedIn, // Ensure the user is logged in
    validateListing, // Validate the listing data
    wrapAsync(listingController.renderCreateFrom) // Handle POST request to create a new listing
  );



//New Route
  router.get("/new", isLoggedIn, listingController.renderNewFrom );



//Show Route & Update Route & Delete Route
router
 .route("/:id")
 .get( wrapAsync (listingController.renderShowFrom))
 .put( 
  isLoggedIn,
  isOwner,
  validateListing, 
  wrapAsync (listingController.renderUpdateFrom))
 .delete(isLoggedIn,isOwner, wrapAsync (listingController.renderDeleteFrom));
  
  
 
  //Edit Route
  router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync (listingController.renderEditFrom));
  
  
 

  module.exports = router;