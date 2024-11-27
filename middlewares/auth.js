const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const { invalidCredentialsCode } = require("../utils/errors");

const auth = (req, res, next) => {
  const excludedRoutes = ["/signin", "/signup"];
  const isExcluded = excludedRoutes.some((route) =>
    req.originalUrl.startsWith(route)
  );

  if (isExcluded) {
    return next();
  }

  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(invalidCredentialsCode)
      .json({ message: "Authorization token required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(invalidCredentialsCode)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
  return null;
};

module.exports = auth;
