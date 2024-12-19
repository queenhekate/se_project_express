const errorHandler = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
};

// The error-handling middleware should log the errors to the console
// with console.error, and should send a response with the correct
// status code and an appropriate message.

// In case of an unforeseen error, return a 500 error code.

module.exports = errorHandler;
