const express = require('express');
const router = express.Router();

// Banco de dados temporário (substitua por um real depois)
let users = [];

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    // Validação simples
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
    
    // Verificar se usuário já existe
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(409).json({ message: 'E-mail já cadastrado' });
    }
    
    // Adicionar usuário (em produção, criptografe a senha!)
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    
    res.status(201).json({ message: 'Usuário criado com sucesso' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(user => user.email === email);
    
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    res.json({ message: 'Login bem-sucedido', user: { id: user.id, name: user.name } });
});

module.exports = router;