const { object, array } = require("joi");
const TransactionModel = require("../models/transactionModel");
const UserModel = require("../models/userModel");
exports.createTransaction = async (data) => {
  try {
    const transaction = await TransactionModel.create(data); // Use `create` for Sequelize
    return transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

exports.getTransaction = async (key) => {
  try {
    const transaction = await TransactionModel.findOne({
      where: key,
      raw: true,
    });
    console.log("we are in get Transactino", transaction);
    return transaction; // Add `where` for filters
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw error;
  }
};


exports.getAllTransactions = async (filters = {}, pagination = {}) => {
  try {
    const { offset, limit } = pagination;

    // Apply filters and pagination
    return await TransactionModel.findAll({
      where: filters,
      include: [
        {
          model: UserModel, // Replace with your actual User model
          as: "sender", // Alias for the association
          attributes: ["id", "name", "email", "phoneNo"], // Select only required columns
        },
      ],
      offset, // Add pagination offset
      limit, // Add pagination limit
      order: [["createdAt", "DESC"]], // Example ordering
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

exports.updateTransaction = async (id, data) => {
  try {
    const transaction = await TransactionModel.findByPk(id); // Fetch by primary key
    if (!transaction) {
      throw new Error(`Transaction with id ${id} not found.`);
    }
    return await transaction.update(data); // Update fields
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

exports.countTransactions = async (filters = {}) => {
  try {
    return await TransactionModel.count({ where: filters }); // Use `count` with `where` clause
  } catch (error) {
    console.error("Error counting transactions:", error);
    throw error;
  }
};
