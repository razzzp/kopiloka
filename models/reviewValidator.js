const Joi = require('joi');

const ReviewValidator = Joi.object({
  rating: Joi.number()
    .required()
    .min(1)
    .max(5)
});

module.exports = ReviewValidator;