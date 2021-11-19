const Joi = require('joi');

const CafeValidator = Joi.object({
  name: Joi.string()
    .alphanum()
    .required(),
  location: Joi.string()
    .alphanum()
    .required(),
  desc: Joi.string()
    .alphanum()
    .required(),
  avgPrice: Joi.number(),
});

module.exports = {CafeValidator};