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