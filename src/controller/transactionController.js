const transactionService = require("../services/transactionService");
const paymentService = require("../services/paymentService");
const { v4: uuidv4 } = require("uuid");
const cookieParser = require('cookie-parser');

exports.initiatePayment = async (req, res, next) => {
  try {
    const {   amount, type, description, status } =
      req.body; // Contains senderId, receiverId, amount, etc.
    // Extract token from the cookie

    

    const senderId = req.user._id;
    const receiverId = '675307767cdef23cb66601e7'

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
    console.log("payment response :",paymentResponse.data)

    res.status(201).json({
      transaction,
      customerDetails: paymentResponse.data.customer_details,
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

    // Initialize filters object
    const filters = {};

    // If the user is a normal user, always set the senderId to the logged-in user's ID
    if (req.user.role === 'user') {
      filters.senderId = req.user._id; // Always set senderId to the logged-in user's ID for normal users
    }

    // If the senderId is passed as a query parameter, allow admins to pass it, but prevent users from overriding their own senderId
    if (senderId && req.user.role !== 'user') {
      filters.senderId = senderId; // Admins can query by senderId, but not normal users
    }

    // Apply other filters if provided
    if (receiverId) filters.receiverId = receiverId;
    if (date) filters.date = date;
    if (status) filters.status = status;

    console.log(filters);

    // Call service to get filtered transactions
    const transactions = await transactionService.getAllTransactions(filters);
    const count = await transactionService.countTransactions(filters);

    res.status(200).json({
      count,
      transactions
    });
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
    // console.log("Here is the request ********",req)
    await paymentService.handlePaymentWebhook(req.body.data);
    res.status(200).send("Webhook processed");
  } catch (error) {
    res.status(400).send("Webhook processing failed");
  }
};
