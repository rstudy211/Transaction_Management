const User = require("../models/userModel");

exports.createUser = async (data) => {
  // Sequelize automatically handles the creation and saving of data
  try {
    const user = await User.create(data); // Equivalent to `save()` in Mongoose
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

exports.findUser = async (userId) => {
  try {
    // Use `findByPk` for primary key lookup (id in this case)
    const user = await User.findByPk(userId); // Equivalent to `findById()` in Mongoose
    return user;
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  try {
    // Use `findOne` to find by specific field (email in this case)
    const user = await User.findOne({
      where: { email: email }, // This replaces the Mongoose `.findOne({ email })`
    });
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

exports.findAllUsers = async () => {
  try {
    // `findAll` is used to get all records (equivalent to `.find()` in Mongoose)
    const users = await User.findAll();
    return users;
  } catch (error) {
    console.error('Error finding all users:', error);
    throw error;
  }
};
