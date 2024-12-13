// Custom Validation Error Class
class ValidationError extends Error {
    constructor(errors) {
      super("Validation Failed");
      this.name = "ValidationError";
      this.errors = errors;
    }
  }

module.exports = {ValidationError}