System Architecture:

- core features
  Identify core features:
  Add, update, delete transactions.
  Categorize transactions (e.g., income, expense).
  Generate summaries or reports.
  Authentication and authorization (optional).

3. Design the Database Schema
   Plan tables/collections:
   Users: id, name, email, password (if authentication is required).
   Transactions: id, user_id, amount, type (income/expense), category, date, description.

project/
├── config/
│ └── dbConfig.js # Database configuration
├── controllers/
│ └── transactionController.js # Controller layer
├── models/
│ └── Transaction.js # Transaction model class
├── routes/
│ └── transactionRoutes.js # API routes
├── services/
│ └── transactionService.js # Service layer
├── .env # Environment variables
├── app.js # Main application entry point
├── package.json # Dependencies and scripts

https://edeb-103-252-242-61.ngrok-free.app/api/transactions/payment/webhook


Task:
- setup join user/admin will able to fetch the transaction with user info
- user only able to fetch /trnsaction/:id that done by it's own other wise "not permited" 
