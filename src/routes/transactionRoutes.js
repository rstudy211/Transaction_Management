const express = require("express");
const transactionController = require("../controller/transactionController");
const router = express.Router();
const { admin, auth } = require("../middleware/auth");
const { whitelistMiddleware, validateHMAC } = require("../middleware/security");
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the transaction
 *         senderId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the sender
 *         amount:
 *           type: number
 *           description: Amount of the transaction
 *         type:
 *           type: string
 *           description: Transaction type (e.g., income, expense)
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date and time of the transaction
 *         description:
 *           type: string
 *           description: Description of the transaction
 *         status:
 *           type: string
 *           description: Status of the transaction (e.g., SUCCESS, PENDING)
 *         orderId:
 *           type: string
 *           description: Order ID associated with the transaction
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the transaction was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the transaction was last updated
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user
 *         username:
 *           type: string
 *           description: The user's username
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 */

/**
 * @swagger
 * /transactions/initiate:
 *   post:
 *     summary: Initiates a new transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Transaction amount
 *               type:
 *                  type: string
 *                  description: Trnsactino Type
 *               description:
 *                 type: string
 *                 description: Description of the transaction
 *     responses:
 *       201:
 *         description: Transaction initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 */
router.post("/initiate", auth, transactionController.initiatePayment);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Retrieves a specific transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", admin, transactionController.getTransaction);

/**
 * @swagger
 * /transactions/:
 *   get:
 *     summary: Retrieves all transactions with optional filters and pagination
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by transaction status (e.g., SUCCESS, PENDING, FAILED)
 *           example: PENDING
 *       - name: type
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by transaction type (e.g., income, expense)
 *           example: income
 *       - name: senderId
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by sender's ID (e.g., 6756066a907fc659e4814f47)
 *           example: df7c49d9-6dcf-43ea-aad4-3a6c193db06d
 *       - name: date
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter by transaction date in ISO format
 *           example: "2024-12-09T20:25:43.084Z"
 *       - name: id
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by transaction ID
 *           example: a45e6fab-8d73-4b37-b675-3c89e0ae9294
 *       - name: createdAt
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter by creation date in ISO format
 *           example: "2024-12-09T20:25:43.084Z"
 *       - name: updatedAt
 *         in: query
 *         schema:
 *           type: string
 *           format: date-time
 *           description: Filter by last updated date in ISO format
 *           example: "2024-12-09T20:25:43.084Z"
 *       - name: orderId
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by order ID
 *           example: CF_c20e9f75-bf11-4e58-938c-91ffda25e79a
 *       - name: amount
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by transaction amount
 *           example: 6999
 *       - name: description
 *         in: query
 *         schema:
 *           type: string
 *           description: Filter by transaction description
 *           example: "Salary payment"
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           description: The page number to retrieve (default is 1)
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           description: The number of transactions per page (default is 10)
 *           example: 10
 *     responses:
 *       200:
 *         description: A paginated list of transactions matching the filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of transactions per page
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of transactions matching the filters
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 */
router.get("/", auth, transactionController.getAllTransactions);

/**
 * @swagger
 * /transactions/payment/callback:
 *   post:
 *     summary: Handles the callback when payment is completed
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: Order ID from the payment gateway
 *               status:
 *                 type: string
 *                 description: Payment status (e.g., SUCCESS, FAILURE)
 *     responses:
 *       200:
 *         description: Payment callback handled successfully
 *       400:
 *         description: Invalid data provided
 */
router.post("/payment/callback", transactionController.handlePaymentCallback);

/**
 * @swagger
 * /transactions/payment/webhook:
 *   post:
 *     summary: Handles notifications from the payment gateway
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Notification event type
 *               payload:
 *                 type: object
 *                 description: Event payload
 *     responses:
 *       200:
 *         description: Payment notification processed successfully
 *       400:
 *         description: Invalid notification data
 */
router.post("/payment/webhook",whitelistMiddleware, transactionController.handlePaymentWebhook);

module.exports = router;
