const User = require('../models/User');
const UserService = require('../services/UserService');
const AuthService = require('../services/AuthService');
const TextController = require('../controllers/TextController');
const emailPasswordStrategy = require('../auth/EmailPasswordStrategy');

// Initialize services
const userService = new UserService(User);
const authService = new AuthService(userService);
const textController = new TextController();

// Register authentication strategies
authService.registerStrategy('email-password', emailPasswordStrategy);

module.exports = {
  userService,
  authService,
  textController
}; 