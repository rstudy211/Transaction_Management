const transactionService = require("../services/transactionService");
const paymentService = require("../services/paymentService");
const TransactionResponseDTO = require("../dtos/transactions/transactionResponseDTO");
const InitiateTransactionDTO = require("../dtos/transactions/initiateTransactionDTO");
const PaginationDTO = require("../dtos/paginationDTO");
const {sendResponse} = require("../utility/responseUtil")
const { v4: uuidv4 } = require("uuid");
const {
  getAllTransactions,
  countTransactions,
} = require("../services/transactionService");
const { z } = require("zod");

exports.initiatePayment = async (req, res, next) => {
  try {
    const { amount, type, description } = req.body;
    const senderId = req.user.id; // Sender ID from authenticated user

    // Generate unique orderId
    const orderId = `CF_${uuidv4()}`;

    // Create transaction DTO (validation happens here)
    const transactionData = new InitiateTransactionDTO({
      orderId,
      senderId,
      amount,
      type,
      description,
    });

    // Save transaction
    const transaction = await transactionService.createTransaction(transactionData);
    console.log("Transaction created successfully:\n", transaction);

    // Create payment order
    const paymentResponse = await paymentService.createPaymentOrder({
      orderId: transactionData.orderId,
      amount: transactionData.amount,
      senderId: transactionData.senderId,
      description: transactionData.description,
    });

    console.log("Payment order created successfully :\n", paymentResponse.data);

    // Send response with transaction and payment session info
    res.status(201).json({
      message: "Payment initiated successfully",
      transaction,
      customerDetails: paymentResponse.data.customer_details,
      paymentSessionId: paymentResponse.data.payment_session_id,
    });
  } catch (error) {
    console.error("Error initiating payment:", error.message);
    next(error);
  }
};

exports.getTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching transaction with ID: ${id}`);

    // Retrieve transaction from the service
    const transaction = await transactionService.getTransaction({ id: id });
    
    if (!transaction) {
      console.log(`Transaction with ID ${id} not found`);
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Create DTO and validate the data
    const transactionResponseDTO = new TransactionResponseDTO({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      senderId: transaction.senderId,
      orderId: transaction.orderId,
      description: transaction.description,
      date: transaction.date,
    });

    // Send the validated DTO response
    res.status(200).json(transactionResponseDTO);
  } catch (error) {
    if (error.message && error.message.startsWith('Validation failed')) {
      console.error('Validation error:', error.message);
      return res.status(400).json({ message: error.message });
    }
    
    console.error("Error fetching transaction:", error.message);
    next(error);  // Pass the error to the next middleware (e.g., global error handler)
  }
};
// Define Zod schema for validation and sanitization
const transactionFilterSchema = z.object({
  senderId: z.string().uuid().trim().optional(),
  status: z.string().trim().optional(),
  id: z.string().uuid().trim().optional(),
  date: z.string().datetime({ offset: true }).trim().optional(),
  createdAt: z.string().datetime({ offset: true }).trim().optional(),
  updatedAt: z.string().datetime({ offset: true }).trim().optional(),
  orderId: z.string().trim().optional(),
  amount: z.string().regex(/^\d+$/).trim().optional(), // Only digits
  type: z.string().trim().optional(),
  description: z.string().max(255).trim().optional(),
});

exports.getAllTransactions = async (req, res, next) => {
  try {
    // Validate and sanitize query parameters using Zod
    const query = transactionFilterSchema.parse(req.query);

    // Extract pagination parameters
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;

    // Build dynamic filters
    const filters = buildTransactionFilters(req.user, query);

    console.log("Filters applied:", filters);

    // Fetch transactions and count concurrently
    const [transactions, totalCount] = await Promise.all([
      getAllTransactions(filters, { offset, limit }),
      countTransactions(filters),
    ]);

    console.log(`${transactions.length} transactions fetched successfully`);

    // Create a paginated response using PaginationDTO
    const paginatedResponse = new PaginationDTO({
      page,
      limit,
      totalCount,
      data: transactions,
    });

    // Respond with paginated results using sendResponse
    sendResponse(res, {
      success: true,
      status: 200,
      message: 'Transactions fetched successfully',
      data: paginatedResponse,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return sendResponse(res, {
        success: false,
        status: 400,
        message: "Invalid query parameters",
        errors: error.errors,
      });
    }
    console.error("Error fetching transactions:", error.message);
    next(error);
  }
};

// Utility function to build filters dynamically
// function buildTransactionFilters(user, query) {
//   const filters = {};

//   // Role-based filter for normal users
//   if (user.role === "user") {
//     filters.senderId = user._id;
//   } else if (query.senderId) {
//     filters.senderId = query.senderId; // Admin-specific filter
//   }

//   // Add valid filters dynamically
//   Object.entries(query).forEach(([key, value]) => {
//     if (value !== undefined) {
//       filters[key] = value;
//     }
//   });

//   return filters;
// }

// Utility function to build filters dynamically
function buildTransactionFilters(user, query) {
  const filters = {};

  // Role-based filter for normal users
  if (user.role === "user") {
    filters.senderId = user.id;
  } else if (query.senderId) {
    filters.senderId = query.senderId; // Admin-specific filter
  }

  // Query-based filters (add non-empty values only)
  const validFilters = [
    "status",
    "id",
    "date",
    "createdAt",
    "updatedAt",
    "orderId",
    "amount",
    "type",
    "description",
  ];

  validFilters.forEach((key) => {
    if (query[key]) {
      filters[key] = query[key];
    }
  });

  return filters;
}

exports.handlePaymentCallback = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    console.log("Handling payment callback for orderId:", orderId);

    const paymentStatus = await paymentService.verifyPayment(orderId);
    console.log("Payment status verified:", paymentStatus);

    res.status(200).json(paymentStatus);
  } catch (error) {
    console.error("Error handling payment callback:", error.message);
    next(error);
  }
};

exports.handlePaymentWebhook = async (req, res, next) => {
  try {
    console.log("Processing payment webhook with data:", req.body.data);

    await paymentService.handlePaymentWebhook(req.body.data);
    console.log("Payment webhook processed successfully");

    res.status(200).send("Webhook processed");
  } catch (error) {
    console.error("Error processing payment webhook:", error.message);
    res.status(400).send("Webhook processing failed");
  }
};
