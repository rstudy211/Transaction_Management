const User = require("../models/userModel");

exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};
exports.findUser = async (userId) => {
  console.log("finding user ");
  return User.findById(userId);
};
exports.findAllUsers = async () => {
  return User.find({});
};
