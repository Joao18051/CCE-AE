const AppError = require('../utils/AppError');

class UserService {
  constructor(userModel) {
    this.User = userModel;
  }

  async findByEmail(email) {
    return await this.User.findOne({ where: { email } });
  }

  async create(userData) {
    return await this.User.create(userData);
  }

  async validatePassword(user, password) {
    return await user.validPassword(password);
  }

  async findById(id) {
    const user = await this.User.findByPk(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }
    return user;
  }

  async update(id, userData) {
    const user = await this.findById(id);
    return await user.update(userData);
  }

  async delete(id) {
    const user = await this.findById(id);
    await user.destroy();
    return true;
  }

  async saveText(userId, text) {
    const user = await this.findById(userId);
    return await user.update({ text });
  }

  async getText(userId) {
    const user = await this.findById(userId);
    if (!user.text) {
      throw new AppError('Nenhum texto encontrado', 404);
    }
    return user.text;
  }
}

module.exports = UserService; 