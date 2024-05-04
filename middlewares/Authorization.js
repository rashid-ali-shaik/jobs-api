const jwt = require("jsonwebtoken");
const { UnAuthorize } = require("../errors");

const Authorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnAuthorize("Invalid token");
  }
  const token = authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.user = { userId: payload.userId, username: payload.username };
    next();
  } catch (error) {
    throw new UnAuthorize("Invalid token");
  }
};

module.exports = Authorization;
