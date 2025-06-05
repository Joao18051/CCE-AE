const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const config = require('../config/appConfig');

const protect = async (req, res, next) => {
  let token;

  // Get token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Não autorizado - Token não fornecido', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Add user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return next(new AppError('Não autorizado - Token inválido', 401));
  }
};

module.exports = {
  protect
}; 