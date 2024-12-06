const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Ensures the amount is non-negative
  },
  type: {
    type: String,
    enum: ["income", "expense"], // Restricts type to specified values
    required: true,
  },
  //   category: {
  //     type: String,
  //     trim: true, // Trims unnecessary whitespace
  //   },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500, // Limits description length for better storage efficiency
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },

  orderId: { type: String, unique: true },
  referenceId: { type: String }, // Optional: For tracking purposes
});

module.exports = mongoose.model("TransactionModel", transactionSchema);
