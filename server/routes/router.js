const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    //Verificar se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'E-mail já cadastrado' });
    }

    //Criar novo usuário
    const newUser = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

//Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //Buscar usuário
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha inválida' });
    }

    //Verificar senha
    const validPassword = await user.validPassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: 'E-mail ou senha inválida' });
    }

    res.json({
      message: 'Login bem-sucedido',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;