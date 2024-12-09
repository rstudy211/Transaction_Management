const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  try {
    console.log("Auth middleware");

    // Retrieve the cookie from the request headers
    const authCookie = req.cookies.Authorization; // Requires cookie-parser middleware
    if (!authCookie) {
      throw new Error("Authorization cookie is missing.");
    }

    // Extract the token from the cookie (remove "Bearer " prefix)
    const token = authCookie.replace("Bearer ", "");
    console.log(token);
    const secret = process.env.JWT_SECRET;

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      throw new Error("User not found.");
    }

    // Attach user and token to the request object
    // req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.error(e.message);
    res.status(401).send({ error: "Please authenticate." });
  }
};

// Admin Access Middleware
const admin = async (req, res, next) => {
  try {
    // Assuming you're using JWT for authentication and have a middleware that decodes the token
    const authCookie = req.cookies.Authorization; // Requires cookie-parser middleware
    if (!authCookie) {
      throw new Error("Authorization cookie is missing.");
    }

    // Extract the token from the cookie (remove "Bearer " prefix)
    const token = authCookie.replace("Bearer ", "");
    console.log(token);
    const secret = process.env.JWT_SECRET;

    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Fetch the user by ID (or use the details from the decoded token)
    const user = await User.findById(decoded.id); // Ensure this matches the structure of your token
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = user;
    // If user is admin, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login required" });
  }
};

module.exports = { admin, auth };
