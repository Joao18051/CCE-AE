const express = require('express');
const authRouter = express.Router();
const { authService, textController } = require('../config/serviceContainer');
const authController = require('../controllers/AuthController');
const { protect } = require('../middleware/authMiddleware');
const conversionHistoryController = require('../controllers/ConversionHistoryController');

authRouter.post('/signup', authController.signup);
authRouter.post('/login', authController.login);

//CRUD texto
authRouter.use('/text', protect);
authRouter.post('/text', textController.saveText);
authRouter.get('/text/:userId', textController.getText);
authRouter.put('/text/:id', textController.updateText);
authRouter.delete('/text/:id', textController.deleteText);

//Histórico
authRouter.use('/conversion-history', protect);
authRouter.post('/conversion-history', conversionHistoryController.saveConversion);
authRouter.get('/conversion-history', conversionHistoryController.getHistory);

//Validação do ID
authRouter.param('userId', (req, res, next, userId) => {
  if (!userId || !Number.isInteger(Number(userId))) {
    return res.status(400).json({ message: 'ID do usuário inválido' });
  }
  req.params.userId = Number(userId);
  next();
});

module.exports = authRouter;