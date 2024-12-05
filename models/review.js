const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: {
    type: String,
    required: true, // You can make comment required if you want
  },
  rating: {
    type: Number,
    required: true, // Ensure rating is required
    min: 1,         // Minimum rating value
    max: 5,         // Maximum rating value
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date to now if not provided
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
