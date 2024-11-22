const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().allow("", null),
    'image.url': Joi.string().uri().allow(null, ''),
    'image.filename': Joi.string().allow(null, ''),
  }).required(),
});


module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),  // Rating must be a number between 1 and 5
    comment: Joi.string().required(),                // Comment must be a non-empty string
  }).required(),
});
