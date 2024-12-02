const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const { invalidCredentialsCode } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(invalidCredentialsCode)
      .json({ message: "Authorization token required" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(invalidCredentialsCode)
        .json({ message: error.message });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(invalidCredentialsCode)
        .json({ message: "Token expired" });
    }
    console.error("Token verification failed:", error.message);
    return res
      .status(invalidCredentialsCode)
      .json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = auth;
