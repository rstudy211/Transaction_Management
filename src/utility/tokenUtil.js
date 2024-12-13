const jwt = require("jsonwebtoken");

const generateToken = (user, secretKey) => {
  return jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: "1h",
  });
};

module.exports = { generateToken };
