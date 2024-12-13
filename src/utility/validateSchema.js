// validationSchemas.js
const Joi = require('joi');

// const schemas = {
//   TransactionDTO: Joi.object({
//     id: Joi.string().required(),
//     amount: Joi.number().required(),
//     type: Joi.string().valid('income', 'expense').required(),
//     status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED').required(),
//     senderId: Joi.string().required(),
//     orderId: Joi.string().required(),
//     description: Joi.string().optional(),
//     date: Joi.date().required(),
//   }),

//   UserDTO: Joi.object({
//     id: Joi.string().required(),
//     name: Joi.string().trim().required(),
//     email: Joi.string().email().required(),
//     role: Joi.string().valid('user', 'admin').required(),
//     createdAt: Joi.date().optional(),
//     updatedAt: Joi.date().optional(),
//   }),

//   // Add more schemas here
// };


const initiateTransactionSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount must be a number',
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required',
  }),
  type: Joi.string().valid("income", "expense").required().messages({
    'string.base': 'Transaction type must be a string',
    'any.required': 'Transaction type is required',
    'any.only': 'Transaction type must be either "debit" or "credit"',
  }),
  senderId: Joi.string().required().messages({
    'string.base': 'Sender ID must be a string',
    'any.required': 'Sender ID is required',
  }),
  orderId: Joi.string().required().messages({
    'string.base': 'Order ID must be a string',
    'any.required': 'Order ID is required',
  }),
  description: Joi.string().max(500).optional().messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description must not exceed 500 characters',
  }),
});



// module.exports = schemas;
module.exports = {initiateTransactionSchema};
