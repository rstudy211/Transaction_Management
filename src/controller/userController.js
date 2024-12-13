const bcrypt = require("bcrypt");
const userService = require("../services/userService");
const {UserDTO} = require("../dtos/user/userDTO");
const LoginUserDTO = require("../dtos/user/loginUserDTO");
const { generateToken } = require("../utility/tokenUtil");
const { sendResponse } = require("../utility/responseUtil");

exports.loginUser = async (req, res, next) => {
  try {
    const loginData = new LoginUserDTO(req.body);

    const user = await userService.findUserByEmail(loginData.email);
    if (!user) {
      return sendResponse(res, {
        success: false,
        status: 404,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      loginData.password,
      user.password
    );
    if (!isPasswordValid) {
      return sendResponse(res, {
        success: false,
        status: 400,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user, process.env.JWT_SECRET);
    return sendResponse(res, {
      success: true,
      status: 200,
      message: "Login successful",
      token,
    });
  } catch (err) {
    return sendResponse(res, {
      success: false,
      status: 500,
      message: err.message,
    });
  }
};

exports.logoutUser = async (req, res, next) => {
  // Remove the authentication token cookie
  res.clearCookie("Authorization");
  // Send a response to indicate successful logout
  return sendResponse(res, {
    success: true,
    status: 200,
    message: "Logged out successfully",
  });
};

exports.createUser = async (req, res, next) => {
  try {
    // Create a DTO instance
    const userDTO = new UserDTO(req.body);


    // Hash the password
    userDTO.password = await bcrypt.hash(userDTO.password, 10);

    // Save the user
    const user = await userService.createUser(userDTO);
    console.log(user)

    // Send success response
    return sendResponse(res, {
      success: true,
      status: 201,
      message: "User created successfully",
      data: user, // Optional: include created user data in the response
    });
  } catch (err) {
    // Handle validation errors
    

    // Handle other errors
    console.error("Error creating user:", err);
    return sendResponse(res, {
      success: false,
      status: 500,
      message: err.message,
    });
  }
};


exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.findUser(userId);

    if (!user) {
      return sendResponse(res, { 
        success: false, 
        status: 404, 
        message: "User not found" 
      });
    }

    // Use UserDTO to validate and format the user data
    const userDTO = new UserDTO(user); // Assuming user object matches the DTO's constructor

    // Send response using the sendResponse utility
    return sendResponse(res, {
      success: true,
      status: 200,
      message: "User found",
      data: userDTO
    });
  } catch (error) {
    next(error);
  }
};


// Get the currently authenticated user (assuming req.user is populated by authentication middleware)
exports.getUser = async (req, res, next) => {
  try {
    // Create a UserDTO instance with the authenticated user data
    const userDTO = new UserDTO(req.user); // Assuming req.user has the properties (name, email, etc.)

    // Send response using the sendResponse utility
    return sendResponse(res, {
      success: true,
      status: 200,
      message: "Authenticated user data",
      data: userDTO
    });
  } catch (error) {
    next(error);
  }
};

exports.allUsers = async (req, res, next) => {
  try {
    const users = await userService.findAllUsers();

    // Use UserDTO to map and format each user
    const usersDTO = users.map((user) => {
      return new UserDTO(user); // Ensure each user object is formatted using the DTO
    });

    // Send response using the sendResponse utility
    return sendResponse(res, {
      success: true,
      status: 200,
      message: "Users retrieved successfully",
      data: usersDTO
    });
  } catch (error) {
    next(error);
  }
};