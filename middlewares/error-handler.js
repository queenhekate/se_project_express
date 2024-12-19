const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  // Check for specific types of errors and set the status code accordingly
  if (err.name === "ValidationError") {
    // Validation error (400 Bad Request)
    return res.status(400).json({ error: "Bad Request Error" });
  }
  if (err.name === "UnauthorizedError") {
    // Unauthorized error (401 Unauthorized)
    return res.status(401).json({ error: "Unauthorized Error" });
  }
  if (err.name === "ForbiddenError") {
    // Forbidden error (403 Forbidden)
    return res.status(403).json({ error: "Forbidden Error" });
  }
  if (err.name === "NotFoundError") {
    // Not found error (404 Not Found)
    return res.status(404).json({ error: "Not Found Error" });
  }
  if (err.code === 11000) {
    // Conflict error (409 Conflict)
    return res.status(409).json({ error: "Conflict Error" });
  }
  // Default to Internal Server Error (500)
  return res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;
