const Joi = require("joi");

class UserDTO {
  constructor({ name, email, role, createdAt, updatedAt, phoneNo, password }) {
    // Define the validation schema using Joi
    const schema = Joi.object({
      name: Joi.string().trim().min(1).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name should have at least 1 character',
      }),
      email: Joi.string().email().trim().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
      }),
      role: Joi.string().valid('admin', 'user', 'manager').optional().messages({
        'any.only': 'Role must be one of [admin, user, manager]',
      }),
      phoneNo: Joi.string().pattern(/^\+?[0-9]{10,15}$/).optional().messages({
        'string.pattern.base': 'Phone number must be a valid format',
      }),
      password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
      }),
      createdAt: Joi.date().optional(),
      updatedAt: Joi.date().optional(),
    });

    // Validate the object against the schema
    const { error, value } = schema.validate({ name, email, role, phoneNo, password, createdAt, updatedAt });

    // If validation fails, throw an error
    if (error) {
      throw new Error(error.details[0].message);
    }

    // If validation passes, assign the validated values to the instance properties
    this.name = value.name;
    this.email = value.email;
    this.role = value.role;
    this.phoneNo = value.phoneNo;
    this.password = value.password;
    this.createdAt = value.createdAt;
    this.updatedAt = value.updatedAt;
  }
}

  module.exports = {UserDTO}
