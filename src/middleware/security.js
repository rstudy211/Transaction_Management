const crypto = require("crypto");

// Allowed IPs from Cashfree
const allowedIPs = ["52.66.25.127", "15.206.45.168"];

// IP Whitelist Middleware
exports.whitelistMiddleware = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"]
  const clientIP = ip ;

  if (allowedIPs.includes(clientIP)) {
    return next();
  }

  console.error(`Unauthorized IP: ${clientIP}`);
  res.status(403).json({ error: "Access denied: Unauthorized IP" });
};

// HMAC Validation Middleware
exports.validateHMAC = (req, res, next) => {
  const signature = req.headers["x-webhook-signature"]; // Cashfree's signature header
  const secret = process.env.CASHFREE_WEBHOOK_SECRET; // Webhook secret from .env

  const payload = JSON.stringify(req.body); // Ensure the body is properly formatted
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Invalid HMAC signature");
    return res.status(403).json({ error: "Invalid signature" });
  }

  next();
};
