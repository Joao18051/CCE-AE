const bcrypt = require('bcrypt');

class PasswordService {
  static SALT_ROUNDS = 10;

  static async hashPassword(plainPassword) {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return await bcrypt.hash(plainPassword, salt);
  }

  static async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = PasswordService;