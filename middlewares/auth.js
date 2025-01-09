const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new UnauthorizedError("Authorization token required");
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Authorization token required");
    }
    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Authorization token expired");
    }
    console.error("Token verification failed:", error.message);
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = auth;
