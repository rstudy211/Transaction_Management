const userService = require("../services/userService");


exports.createUser = async (req, res, next) => {
  try {
    const userDetails = req.body;
    const user = await userService.createUser(userDetails);

    res.status(201).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.findUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.allUsers = async(req, res, next)=>{
    try {
        const users = await userService.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}