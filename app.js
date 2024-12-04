const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session");
const flash = require("connect-flash");

//This part is seprated because of router
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
// const Listing = require("./models/listing.js"); 
// const wrapAsync = require("./utils/wrapAsync.js")

//This is require for seprate router
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.get("/", async (req, res) => {
  res.send("WanderLust");
});


app.use(session(sessionOptions));
app.use(flash());


app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Set 'success' flash message to res.locals
  res.locals.error = req.flash("error"); // Set 'success' flash message to res.locals
  next(); // Call next middleware
});

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   console.log(success);
//   next();
// });


//This line for use routes for listings
app.use("/listings", listings);
//This line for use routes for reviews
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));  // Forwarding error with 404 status
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

