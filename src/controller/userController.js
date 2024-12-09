const userService = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email

    const user = await userService.findUserByEmail(email);
    if (!user)
      return res.status(404).json({ error: "Invalid email or password" });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ error: "Invalid email or password" });

    const secretKey = process.env.JWT_SECRET;
    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    // Set token in an HTTP-only cookie
    res.cookie("Authorization", `Bearer ${token}`, {
      httpOnly: true, // Prevents access from JavaScript
      secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
      sameSite: "strict", // Protects against CSRF
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Respond with success message
    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = async (req, res, next) => {
  // Remove the authentication token cookie
  res.clearCookie("Authorization");
  // Send a response to indicate successful logout
  res.status(200).json({ message: "Logged out successfully" });
};

exports.createUser = async (req, res, next) => {
  const { name, email, password, phoneNo } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      phoneNo,
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUserById = async (req, res, next) => {
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

exports.getUser = async (req, res, next) => {
  // console.log("kjdskj", req.user);
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
};

exports.allUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();
    const userDto = users.map((user) => {
      return {
        name: user.name,
        email: user.email,
      };
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
