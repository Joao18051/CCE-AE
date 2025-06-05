const IAuthStrategy = require('../interfaces/IAuthStrategy');
const AppError = require('../utils/AppError');

class EmailPasswordStrategy extends IAuthStrategy {
  async validateCredentials(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new AppError('E-mail e senha são obrigatórios', 400);
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      throw new AppError('E-mail inválido', 400);
    }

    if (password.length < 8) {
      throw new AppError('Senha deve ter pelo menos 8 caracteres', 400);
    }
  }

  async authenticate(credentials, userService) {
    await this.validateCredentials(credentials);
    const { email, password } = credentials;

    const user = await userService.findByEmail(email);
    if (!user) {
      throw new AppError('E-mail ou senha inválida', 401);
    }

    const validPassword = await userService.validatePassword(user, password);
    if (!validPassword) {
      throw new AppError('E-mail ou senha inválida', 401);
    }

    return user;
  }

  async getUserInfo(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}

module.exports = new EmailPasswordStrategy();  