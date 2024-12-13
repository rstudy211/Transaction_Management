const app = require('./app');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "127.0.0.1",() => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
