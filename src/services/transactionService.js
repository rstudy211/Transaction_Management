const TransactionModel = require("../models/transactionModel");

exports.createTransaction = async (data) => {
  const transaction = new TransactionModel(data);
  return await transaction.save();
};

exports.getTransaction = async (key) => {
  return await TransactionModel.findOne(key); // Use `findOne` for single record
};

exports.getAllTransactions = async (filters = {}) => {
  return await TransactionModel.find(filters); // Pass filters dynamically
};


exports.updateTransaction = async (transaction) => {
  return await transaction.save();
};

exports.countTransactions = async (filters)=>{
  return await TransactionModel.countDocuments(filters);
}