const express = require('express');
const router = express.Router();

// Rotas de exemplo
router.get('/', (req, res) => {
    // Renderiza o template "home.hbs"
    res.render('home', { title: 'AquaPulse Irrigações' });
});

module.exports = router;
