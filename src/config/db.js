const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with connection pooling
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Disable logging in production
    pool: {
      max: 10, // Maximum number of connections in the pool
      min: 2, // Minimum number of connections in the pool
      acquire: 30000, // Maximum time (in ms) to try acquiring a connection
      idle: 10000, // Maximum time (in ms) a connection can be idle before being released
    },
  }
);

// Test the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync models (uncomment when ready to create tables)
    // await sequelize.sync({ alter: true });
    // console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Close the database connection when the application exits
const closeDB = async () => {
  try {
    await sequelize.close();
    console.log('Database connection closed successfully.');
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
};

// Handle graceful shutdown of the application
process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing database connection...');
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing database connection...');
  await closeDB();
  process.exit(0);
});

process.on('SIGUSR2', async () => {
  console.log('Nodemon is restarting the application...');
  // Clean up resources before restart
  await closeDB(); // Close DB connection if using Sequelize
  process.exit(0); // Exit gracefully
});

module.exports = {
  sequelize,
  connectDB,
};
