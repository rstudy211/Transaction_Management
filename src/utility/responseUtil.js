// responseUtil.js
const sendResponse = (res, { success, status, message, token = null, data = null, erros= null }) => {
  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000, // 1 hour in milliseconds
  };

  // Set token as HTTP-only cookie if provided
  if (token) {
    res.cookie("Authorization", `Bearer ${token}`, cookieOptions);
  }

  // Construct response payload
  const responsePayload = { success, message };
  if (data) responsePayload.data = data;
  if (token) responsePayload.token = token;

  // Send response
  return res.status(status).json(responsePayload);
};

module.exports = { sendResponse };
