const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication failed" });
  }

  const token = authorization.split(" ")[1];
  try {
    const { userId, userName } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId, userName };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication failed" });
  }
}

module.exports = authorize;
