const errorHandler = (err, req, res, next) => {
  console.error(">> ERROR: ", err); // Log the error for debugging
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  // Default to Internal Server Error (500)
  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
