const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Transaction Management API",
    version: "1.0.0",
    description: "API documentation for the Transaction Management system",
  },
  servers: [
    {
      url: "http://localhost:3000/api", // Replace with your server URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/controller/*.js"], // Path to the files where you defined your API
};

// Create the Swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Setup Swagger UI middleware
const swaggerSetup = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerSetup;
