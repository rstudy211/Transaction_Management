const transactionService = require("../services/transactionService");
const paymentService = require("../services/paymentService");
const { v4: uuidv4 } = require("uuid");

exports.initiatePayment = async (req, res, next) => {
  try {
    const { senderId, receiverId, amount, type, description, status } =
      req.body; // Contains senderId, receiverId, amount, etc.

    // 1. Generate Unique IDs
    const transactionId = uuidv4();
    const orderId = `CF_${transactionId}`;
    const dto = {
      transactionId,
      orderId,
      senderId,
      receiverId,
      amount,
      type,
      description,
      status,
    };
    // 2. Save the transaction first
    const transaction = await transactionService.createTransaction(dto);

    // Create a payment order with Cashfree
    const paymentResponse = await paymentService.createPaymentOrder({
      orderId: dto.orderId,
      amount: dto.amount,
      senderId: dto.senderId,
      description: dto.description,
    });

    res.status(201).json({
      transaction,
      paymentSessionId: paymentResponse.data.payment_session_id,
    });
  } catch (error) {
    console.log(error);

    // next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransaction(req.params.id); // Corrected to `req.params.id`
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const { senderId, receiverId, date, status } = req.query;

    // Pass filters as a combined object
    const filters = {};
    if (senderId) filters.senderId = senderId;
    if (receiverId) filters.receiverId = receiverId;
    if (date) filters.date = date;
    if (status) filters.status = status;

    console.log(filters);
    // Call service with filters
    const transactions = await transactionService.getAllTransactions(filters);

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.handlePaymentCallback = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    const paymentStatus = await paymentService.verifyPayment(orderId);
    res.status(200).json(paymentStatus);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.handlePaymentWebhook = async (req, res, next) => {
  try {
    console.log("Step 1: We are in webhook");
    await paymentService.handlePaymentWebhook(req.body.data);
    res.status(200).send("Webhook processed");
  } catch (error) {
    res.status(400).send("Webhook processing failed");
  }
};
