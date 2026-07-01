// middleware/validateMiddleware.js
// Reusable validation result handler using express-validator

const { validationResult } = require("express-validator");

/**
 * Middleware: validate
 * Checks the result of express-validator validation chains.
 * If errors exist, returns a 422 response with all validation messages.
 * Otherwise, calls next() to proceed to the controller.
 *
 * Usage: Place after validation chains in route definitions.
 * Example: router.post("/register", registerValidation, validate, authController.register)
 *
 * @param {Request}  req  - Express request object
 * @param {Response} res  - Express response object
 * @param {Function} next - Express next function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors into a clean array of messages
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: extractedErrors,
    });
  }

  next();
};

module.exports = { validate };
