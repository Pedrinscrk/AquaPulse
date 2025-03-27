require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const routes = require('./routes/index');
const localtunnel = require('localtunnel');

const app = express();
const port = process.env.PORT || 1000;
const hostname = '0.0.0.0'; // Mantemos para permitir conexões externas

app.engine('hbs', engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use('/', routes);

app.listen(port, hostname, async () => {

    console.log(`Equipe Aquapulse: Servidor ONLINE:`);
    console.log(` Local: http://localhost:${port}`);
   
    
    try {
        const tunnel = await localtunnel({ 
            port: Number(port),
            subdomain: 'aquapulse',
            headers: { "bypass-tunnel-reminder": "true" } // Bypass da senha
        });
        console.log(` Link público: ${tunnel.url}`);
    } catch (error) {
        console.log('⚠️ Erro no túnel:', error.message);
    }
});