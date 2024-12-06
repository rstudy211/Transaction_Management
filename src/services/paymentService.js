const cashfree = require("../config/cashfree");
const userService = require("../services/userService");
const transactionService = require("../services/transactionService");

exports.createPaymentOrder = async (transactionDetails) => {
  try {
    const { orderId, amount, senderId, description } = transactionDetails;
    
    // Fetch the user details (handle undefined case for safety)
    const customer = await userService.findUser(senderId);
    console.log("customer find:",customer)
    const customerDetails = {
      customer_id: `USER-${customer?._id || 'UNKNOWN'}`, // Fallback to 'UNKNOWN' if user _id is undefined
      customer_name: customer?.name || 'Test Customer', // Default name
      customer_phone: customer?.phone || '9999999999', // Default phone number
      customer_email: customer?.email || 'abc@gmail.com', // Default email
    };
    // console.log(process.env.CASHFREE_NOTIFY_URL)
    const order = {
      order_id: orderId,
      order_amount: String(amount), // Ensure the amount is a string
      order_currency: "INR",
      customer_details: customerDetails,
      order_meta: {
        return_url: process.env.CASHFREE_RETURN_URL || 'https://default-url.com/callback', // Use environment variable
        notify_url: process.env.CASHFREE_NOTIFY_URL || 'https://default-url.com/notify', // Use environment variable
      },
      order_note: description,
    };

    console.log('Creating Order:', order);
    
    // Make request to Cashfree API to create the order
    const response = await cashfree.PGCreateOrder("2023-08-01", order);

    return response;
  } catch (error) {
    console.error("Cashfree Order Creation Error:", error.message);
    throw new Error(`Unable to create payment order for orderId: ${transactionDetails.orderId}`);
  }
};

exports.verifyPayment = async (orderId) => {
  try {
    const orderStatus = await cashfree.PGOrderStatus(orderId);
    const transaction = await transactionService.getTransaction({ orderId });

    if (!transaction) {
      throw new Error(`Transaction not found for orderId: ${orderId}`);
    }

    const updatedStatus = {
      "PAID": "SUCCESS",
      "ACTIVE": "PENDING",
      "FAILED": "FAILED"
    }[orderStatus.order_status] || "FAILED";

    transaction.status = updatedStatus;
    await transactionService.updateTransaction(transaction);

    return {
      orderId: orderStatus.order_id,
      status: transaction.status,
      amount: orderStatus.order_amount,
    };
  } catch (error) {
    console.error("Payment Verification Error:", error.message);
    throw new Error(`Payment verification failed for orderId: ${orderId}`);
  }
};

exports.handlePaymentWebhook = async (webhookPayload) => {
  try {
    // In production, verify the webhook signature for security
    // const isValidWebhook = cashfree.PGVerifyWebhookSignature(webhookPayload);

    // If webhook verification fails, log the error and return a failure response
    // if (!isValidWebhook) {
    //   console.error("Invalid Webhook Signature");
    //   throw new Error("Webhook signature verification failed");
    // }

    const { order, payment } = webhookPayload;
    console.log('Received Webhook:', order, payment);

    // Ensure the order and payment objects are properly received
    if (!order || !payment) {
      console.error("Webhook payload missing order or payment details");
      throw new Error("Invalid webhook payload structure");
    }

    // Get the transaction based on `orderId` and `type`
    const transaction = await transactionService.getTransaction({
      orderId: order.order_id,
      type: 'income', // Assuming you're filtering by 'income' type transactions
    });

    // If the transaction exists, update its status
    if (transaction) {
      const status = payment.payment_status === "SUCCESS" ? "SUCCESS" : "FAILED";
      transaction.status = status;
      console.log(`Transaction Status Updated for orderId ${order.order_id}: ${status}`);

      // Update the transaction status in the database
      await transactionService.updateTransaction(transaction);
    } else {
      // Log a warning if no transaction was found for the given orderId
      console.warn(`No transaction found for orderId: ${order.order_id}`);
    }

    // Return a success response
    return { success: true };
  } catch (error) {
    // Handle any error during the webhook processing
    console.error("Webhook Processing Error:", error.message);
    throw new Error(`Webhook processing failed for orderId: ${webhookPayload?.order?.order_id || 'Unknown'}`);
  }
};
