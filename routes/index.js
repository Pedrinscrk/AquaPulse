const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
res.render('home', { title: 'AquaPulse Irrigações' });
});

router.get('/products', (req, res) => {
    res.render('products', { title: 'AquaPulse Produtos' });
    });

router.get('/suporte', (req, res) => {
    res.render('suporte', { title: 'AquaPulse Suporte' });
    });    

router.get('/aplicativo', (req, res) => {
    res.render('aplicativo', { title: 'AquaPulse Aplicativo' });
    });  

router.get('/botanica', (req, res) => {
    res.render('botanica', { title: 'AquaPulse Botanica' });
    });      

router.get('/documentacao', (req, res) => {
    res.render('documentacao', { title: 'AquaPulse Documentação' });
  });
module.exports = router;


