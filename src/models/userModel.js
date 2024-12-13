const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");
const TransactionModel = require("./transactionModel");
const User = sequelize.define("User", {
  id: {
    type: DataTypes.UUID, // Use Sequelize's UUID data type
    defaultValue: Sequelize.UUIDV4, // Automatically generates a UUID
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

User.hasMany(TransactionModel, {
  foreignKey: "senderId",
  as: "sender",
});

TransactionModel.belongsTo(User, {
  as: "sender",
  foreignKey: "senderId",
  onDelete: "CASCADE",
});

module.exports = User;
