const express = require("express");
const transactionController = require("../controller/transactionController");
const router = express.Router();
const {admin,auth} = require("../middleware/auth")

// POST: Initiates a new transaction
router.post("/initiate",auth, transactionController.initiatePayment);

// GET: Retrieves a specific transaction by ID
router.get("/:id",admin, transactionController.getTransaction);

// GET: Retrieves all transactions, optionally filtered
router.get("/",auth, transactionController.getAllTransactions);

// POST: For handling callback when payment done
router.post("/payment/callback", transactionController.handlePaymentCallback);

// POST: For handling notification when payment done
router.post("/payment/notify", transactionController.handlePaymentWebhook);

module.exports = router;
