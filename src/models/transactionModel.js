const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/db"); // Make sure you have the dbConfig file
const User = require("./userModel");
const TransactionModel = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID, // Use Sequelize's UUID data type
      defaultValue: Sequelize.UUIDV4, // Automatically generates a UUID
      allowNull: false,
      primaryKey: true,
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // Assuming you have a Users table
        key: "id", // Referencing the id of the Users table
      },
    },
    amount: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      validate: {
        min: 0, // Ensures the amount is non-negative
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["income", "expense"]], // Ensuring the type is either income or expense
      },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Defaults to the current date and time
    },
    description: {
      type: DataTypes.STRING(500), // Max length of 500 characters
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING", // Default status is PENDING
      validate: {
        isIn: [["PENDING", "SUCCESS", "FAILED"]], // Enum for status
      },
    },
    orderId: {
      type: DataTypes.STRING,
      unique: true, // Ensuring unique order IDs
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transactions", // The table name in PostgreSQL
    timestamps: false, // Disable automatic timestamp columns like createdAt/updatedAt
  }
);

// User.hasMany(TransactionModel, {
//   foreignKey: "senderId",
//   as: "sender",
// });

// TransactionModel.belongsTo(User, {
//   as: "sender",
//   foreignKey: "senderId",
//   onDelete: "CASCADE",
// });

module.exports = TransactionModel;
