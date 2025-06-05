class IAuthStrategy {
  async authenticate(credentials) {
    throw new Error('Method authenticate() must be implemented');
  }

  async validateCredentials(credentials) {
    throw new Error('Method validateCredentials() must be implemented');
  }

  async getUserInfo(user) {
    throw new Error('Method getUserInfo() must be implemented');
  }
}

module.exports = IAuthStrategy; 