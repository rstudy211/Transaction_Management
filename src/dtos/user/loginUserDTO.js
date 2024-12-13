const Joi = require("joi");

class LoginUserDTO {
  constructor({ email, password }) {
    // Define the validation schema using Joi
    const schema = Joi.object({
      email: Joi.string().email().trim().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
      }),
      password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
      }),
    });

    // Validate the object against the schema
    const { error, value } = schema.validate({ email, password });

    // If validation fails, throw an error
    if (error) {
      throw new Error(error.details[0].message);
    }

    // If validation passes, assign the validated values to the instance properties
    this.email = value.email;
    this.password = value.password; // Do not expose password directly
  }
}

module.exports = LoginUserDTO;
