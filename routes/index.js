const express = require('express');
const router = express.Router();

// Rotas de exemplo
router.get('/', (req, res) => {
    // Renderiza o template "home.hbs"
    res.render('home', { title: 'Página Inicial' });
});

router.get('/register', (req, res) => {
    // Renderiza o template "register.hbs"
    res.render('register', { title: 'Página de Cadastro' });
});

module.exports = router;
