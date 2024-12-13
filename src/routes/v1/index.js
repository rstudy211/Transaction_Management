const express = require("express");
const userRoutes = require("../../routes/userRoutes");
const transactionRoutes = require("../../routes/transactionRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);

module.exports = router;
