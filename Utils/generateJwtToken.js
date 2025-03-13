const jwt = require("jsonwebtoken");
const generateJwtToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

module.exports = generateJwtToken;