const Joi = require('joi');

// Define the environment variable schema
const envSchema = Joi.object({
  PORT: Joi.number().port().required(),
  MONGO_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(10).required(),
  CASHFREE_CLIENT_ID: Joi.string().min(1).required(),
  CASHFREE_CLIENT_SECRET: Joi.string().min(1).required(),
  CASHFREE_ENV: Joi.string().valid('sandbox', 'production',"TEST").required(),
  CASHFREE_RETURN_URL: Joi.string().uri().optional(),
  DB_USER: Joi.string().min(1).required(),
  DB_PASSWORD: Joi.string().min(1).required(),
  DB_HOST: Joi.string().min(1).required(),
  DB_PORT: Joi.number().port().required(),
  DB_NAME: Joi.string().min(1).required(),
}).unknown(); // Allows extra environment variables that aren't in the schema

// Validate the environment variables
const { error } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  console.error('Environment variable validation failed:', error.details.map(x => x.message).join(', '));
  process.exit(1); // Exit the application if validation fails
} else {
  console.log('Environment variables validated successfully!');
}
