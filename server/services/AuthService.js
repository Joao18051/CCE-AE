const AppError = require('../utils/AppError');

class AuthService {
  constructor(userService) {
    this.userService = userService;
    this.strategies = new Map();
  }

  registerStrategy(name, strategy) {
    this.strategies.set(name, strategy);
  }

  getStrategy(name) {
    const strategy = this.strategies.get(name);
    if (!strategy) {
      throw new AppError(`Authentication strategy ${name} not found`, 400);
    }
    return strategy;
  }

  async authenticate(strategyName, credentials) {
    const strategy = this.getStrategy(strategyName);
    const user = await strategy.authenticate(credentials, this.userService);
    return strategy.getUserInfo(user);
  }

  async register(userData) {
    const strategy = this.getStrategy('email-password');
    await strategy.validateCredentials(userData);

    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const newUser = await this.userService.create(userData);
    return strategy.getUserInfo(newUser);
  }
}

module.exports = AuthService; 