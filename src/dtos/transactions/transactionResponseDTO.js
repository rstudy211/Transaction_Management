const Joi = require('joi');

class TransactionResponseDTO {
  constructor({
    id,
    amount,
    type,
    status,
    senderId,
    orderId,
    description,
    date,
  }) {
    // Perform validation when the constructor is called
    const { error } = this.validate({
      id,
      amount,
      type,
      status,
      senderId,
      orderId,
      description,
      date,
    });

    if (error) {
      throw new Error(`Validation failed: ${error.details[0].message}`);
    }

    this.id = id;
    this.amount = parseFloat(amount);
    this.type = type;
    this.status = status.trim();
    this.senderId = senderId;
    this.orderId = orderId;
    this.description = description?.trim();
    this.date = new Date(date);
  }

  // Joi validation schema
  validate(data) {
    const schema = Joi.object({
      id: Joi.string().required(),
      amount: Joi.number().positive().required(),
      type: Joi.string().valid('income', 'expense').required(),
      status: Joi.string().valid('PENDING', 'SUCCESS', 'FAILED').required(),
      senderId: Joi.string().required(),
      orderId: Joi.string().required(),
      description: Joi.string().max(255).optional(),
      date: Joi.date().iso().required(),
    });

    return schema.validate(data);
  }
}

module.exports = TransactionResponseDTO;
