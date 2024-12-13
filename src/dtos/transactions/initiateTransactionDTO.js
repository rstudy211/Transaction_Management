const {initiateTransactionSchema} = require("../../utility/validateSchema")

class InitiateTransactionDTO {
  constructor({
    amount,
    type,
    senderId,
    orderId,
    description,
  }) {
    // Validate the input data against the Joi schema
    const { error, value } = initiateTransactionSchema.validate({
      amount,
      type,
      senderId,
      orderId,
      description,
    });

    if (error) {
      throw new Error(`Validation failed: ${error.details.map((x) => x.message).join(', ')}`);
    }

    // If validation passes, assign the values
    this.amount = parseFloat(value.amount);
    this.type = value.type;
    this.senderId = value.senderId;
    this.orderId = value.orderId;
    this.description = value.description?.trim();
  }
}

module.exports = InitiateTransactionDTO;
