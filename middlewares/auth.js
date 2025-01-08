const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-error");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new BadRequestError("Authorization token required");
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new BadRequestError("Authorization token required");
    }
    if (error.name === "TokenExpiredError") {
      throw new BadRequestError("Authorization token expired");
    }
    console.error("Token verification failed:", error.message);
    throw new BadRequestError("Invalid token");
  }
};

module.exports = auth;
