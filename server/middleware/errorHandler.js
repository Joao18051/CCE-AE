const AppError = require('../utils/AppError');

const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const handleSequelizeError = (err) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return new AppError(`${field} já está em uso`, 409);
  }
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(error => error.message);
    return new AppError(messages.join('. '), 400);
  }
  return err;
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name && err.name.startsWith('Sequelize')) {
    err = handleSequelizeError(err);
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } 
  else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } 
    else {
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Algo deu errado!'
      });
    }
  }
};

module.exports = {
  catchAsync,
  errorHandler
}; 