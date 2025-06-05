const { catchAsync } = require('../middleware/errorHandler');
const { authService } = require('../config/serviceContainer');
const jwt = require('jsonwebtoken');
const config = require('../config/appConfig');

class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  signup = catchAsync(async (req, res) => {
    const user = await this.authService.register(req.body);
    const token = this.generateToken(user);
    
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userResponse,
      token
    });
  });

  login = catchAsync(async (req, res) => {
    const user = await this.authService.authenticate('email-password', req.body);
    const token = this.generateToken(user);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    res.json({
      message: 'Login bem-sucedido',
      user: userResponse,
      token
    });
  });
}

module.exports = new AuthController(authService); 